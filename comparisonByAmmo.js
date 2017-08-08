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

var exportData = {'root':[]}
//------------------------------------------
console.log("pre-loading done!")
//create the strings data
var yamlprased = yaml.safeLoad(fs.readFileSync('en.yaml', 'utf8'));
fs.writeFileSync('strings.json', JSON.stringify(yamlprased))
var strings = require('./strings.json')
//precompile Shell data into Json first

for (y=0; y < list.folders.length; y++){
	console.log("now staring to process nation: " + list.folders[y])
	//prammoComparison[list.folders[y]] = {}
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
		var shellsArray = Object.keys(beforeShells.root)
		for(e = 0; e < shellsArray.length; e++){
			if(shellsArray[e] == 'icons'){
				shellsArray.splice(e, 1)
			}
		}
		console.log(shellsArray)
		//get the current gun
		for (i=0; i < shellsArray.length; i++){
			var price
			var afterPrice
			var discount
			var currentshell = shellsArray[i];
			var Caliber
			var shellName = strings[beforeShells.root[currentshell][0].userString[0]]
			console.log("Currently Processing shell: " + shellsArray[i]);
			//get the shell caliber
				if(typeof beforeShells.root[currentshell][0].price[0] == 'object'){
					price = beforeShells.root[currentshell][0].price[0]._ * 400
					console.log(price)
					afterPrice = afterShells.root[currentshell][0].price[0]._ * 400
					discount = (( price - afterPrice ) / price * 100)
					Caliber = beforeShells.root[currentshell][0].caliber[0]
					//prammoComparison[list.folders[y]][shellsArray[i]]={
					//	"3.8 Price": price,
					//	"3.9 Price": afterPrice,
					//	"Discount Percentage": discount
					//}
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
					exportData.root.push({
						'Shell': shellsArray[i],
						'In-game Shell Name:': shellName,
						'Shell Caliber': beforeShells.root[currentshell][0].caliber[0],
						'3.8 Price': price,
						'3.9 Price': afterPrice,
						'Discount Percentage': discount
					})
				}
		}
}
console.log("Overall Discount: " + ((totalPrice-totalPriceNew)/totalPrice*100) )
console.log("Overall Discount Excluding Zeros: " + ((excludeZero-excludeZeroNew)/excludeZero*100))
console.log("Average Percentage: " + percentage/count)
console.log("Average Percentage Excluding Zeros: " + percentageExcludeZero/countpercentage) 
var endresult = JSON.stringify(exportData)
fs.writeFileSync('./ComparisonByAmmoXLS.json', endresult)