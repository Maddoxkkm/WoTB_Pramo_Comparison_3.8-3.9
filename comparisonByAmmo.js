console.log("Starting Script...... Please wait while the script starts")
console.time('Comparison Duration')

var prammoComparison = {}
//console.log("")
//for Copy and Paste :P 
var fs = require('fs')
var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');
var list = require('./folders.json')
var totalPrice = 0
var totalPriceNew = 0
var excludeZero = 0
var excludeZeroNew = 0
//------------------------------------------
console.log("pre-loading done!")
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
	
	//end of precompliation
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
			var currentshell = shellsArray[i];
			console.log("Currently Processing shell: " + shellsArray[i]);
			//get the shell caliber
				if(typeof beforeShells.root[currentshell][0].price[0] == 'object'){
					var price = beforeShells.root[currentshell][0].price[0]._ * 400
					var afterPrice = afterShells.root[currentshell][0].price[0]._ * 400
					var discount = (( price - afterPrice ) / price * 100)
					prammoComparison[list.folders[y]][shellsArray[i]]={
						"3.8 Price": price,
						"3.9 Price": afterPrice,
						"Discount Percentage": discount
					}
					totalPrice = totalPrice + price
					totalPriceNew = totalPriceNew + afterPrice
					if (price-afterPrice != 0){
						excludeZero = excludeZero + price
						excludeZeroNew = excludeZeroNew + afterPrice
					}
				}
			
		}
};
console.log("Overall Discount: " + ((totalPrice-totalPriceNew)/totalPrice*100) )
console.log("Overall Discount Excluding Zeros: " + ((excludeZero-excludeZeroNew)/excludeZero*100))
var endresult = JSON.stringify(prammoComparison)
fs.writeFileSync('./GoldRoundsComparison.json', endresult)