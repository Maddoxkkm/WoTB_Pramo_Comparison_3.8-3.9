console.log("Starting Script...... Please wait while the script starts")
console.time('Comparison Duration')

var prammoComparison = {}
//console.log("")
//for Copy and Paste :P 
var fs = require('fs')
var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');
var list = require('./folders.json')
var yaml = require('js-yaml')
var totalPrice = 0
var totalPriceNew = 0
var excludeZero = 0
var excludeZeroNew = 0
var percentage = 0
var count = 0 
var percentageExcludeZero = 0
var countpercentage = 0
//------------------------------------------
console.log("pre-loading done!")
//create the strings data
var yamlprased = yaml.safeLoad(fs.readFileSync('en.yaml', 'utf8'));
fs.writeFileSync('strings.json', JSON.stringify(yamlprased))
var strings = require('./strings.json')
//precompile Shell data into Json first

for (y=0; y < list.folders.length; y++){
	console.log("now staring to process nation: " + list.folders[y])
	prammoComparison[list.folders[y]] = {}
	var currentdir = list.folders[y]
	var data = fs.readFileSync('Original/' + currentdir + '/components/shells.xml', 'utf8')
	parseString(data, function(err, result){
		var write = JSON.stringify(result)
		fs.writeFileSync('Original/shells_' + list.folders[y] + '.json', write)
	})
	var data = fs.readFileSync('After/' + currentdir + '/components/shells.xml', 'utf8')
	parseString(data, function(err, result){
		var write = JSON.stringify(result)
		fs.writeFileSync('After/shells_' + list.folders[y] + '.json', write)
	})
	var data = fs.readFileSync('Original/' + currentdir + '/list.xml', 'utf8')
	parseString(data, function(err, result){
		var write = JSON.stringify(result)
		fs.writeFileSync('Original/list_' + list.folders[y] + '.json', write)
	})
	
	//end of precompliation
	var tankNameXML = require('./Original/list_' + list.folders[y] + '.json')
	var beforeShells = require('./Original/shells_' + list.folders[y] + '.json')
	var afterShells = require('./After/shells_' + list.folders[y] + '.json')
	
	//main
	var data = fs.readFileSync('Original/' + currentdir + '/components/guns.xml', 'utf8')
	parseString(data, function(err, result){
		//gets gun array
		var gunarray = Object.keys(result.root.shared[0])
		
		//get the current gun
		for (i=0; i < gunarray.length; i++){
			var currentgun = eval(result.root.shared[0][gunarray[i]]);
			console.log("Currently Processing Gun: " + gunarray[i]);
			var gunName = strings[currentgun[0].userString[0]]
			prammoComparison[list.folders[y]][gunName] = {}
			prammoComparison[list.folders[y]][gunName]["Gun Used By Tanks"] = []
			//get the shell caliber
			var shellarray = Object.keys(currentgun[0].shots[0]);
			for (z=0; z < shellarray.length; z++){
				var currentshell = shellarray[z]; //no changes needed
				var shellName = strings[beforeShells.root[currentshell][0].userString[0]]
				if(typeof beforeShells.root[currentshell][0].price[0] == 'object'){
					var price = beforeShells.root[currentshell][0].price[0]._ * 400
					var afterPrice = afterShells.root[currentshell][0].price[0]._ * 400
					var discount = (( price - afterPrice ) / price * 100)
					prammoComparison[list.folders[y]][gunName][shellName]={
						"3.8 Price": price,
						"3.9 Price": afterPrice,
						"Discount Percentage": discount
					}
					percentage = percentage + discount
					count = count + 1
					totalPrice = totalPrice + price
					totalPriceNew = totalPriceNew + afterPrice
					if (price-afterPrice != 0){
						percentageExcludeZero = percentageExcludeZero + discount
						countpercentage = countpercentage + 1
						excludeZero = excludeZero + price
						excludeZeroNew = excludeZeroNew + afterPrice
					}
					var pertank = fs.readdirSync('Original/' + list.folders[y] + '/')
					for(e = 0; e < pertank.length; e++){
						if(pertank[e] == 'components' | pertank[e] == 'customization.xml'| pertank[e] == 'list.xml'){
							pertank.splice(e, 1)
						}
						if(pertank[e] == 'components' | pertank[e] == 'customization.xml'| pertank[e] == 'list.xml'){
							pertank.splice(e, 1)
						}
						if(pertank[e] == 'components' | pertank[e] == 'customization.xml'| pertank[e] == 'list.xml'){
							pertank.splice(e, 1)
						}
					}
					for(b = 0; b < pertank.length; b++){
						var currenttank = fs.readFileSync('Original/' + list.folders[y] + '/' + pertank[b], 'utf8')
						if(currenttank.search("<" + gunarray[i] + ">") != -1){
							var tankName = strings[tankNameXML.root[pertank[b].substr(0, pertank[b].search(".xml"))][0].userString[0]]
							
							prammoComparison[list.folders[y]][gunName]["Gun Used By Tanks"].splice(0,0, tankName)
						}
					}
				}
			}
		}
	});
};
console.log("Overall Discount: " + ((totalPrice-totalPriceNew)/totalPrice*100) )
console.log("Overall Discount Excluding Zeros: " + ((excludeZero-excludeZeroNew)/excludeZero*100))
console.log("Average Percentage: " + percentage/count)
console.log("Average Percentage Excluding Zeros: " + percentageExcludeZero/countpercentage) 
var endresult = JSON.stringify(prammoComparison)
fs.writeFileSync('./GoldRoundsComparison.json', endresult)
	