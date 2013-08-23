#!/usr/bin/env node

// defines
var host_url 			= "http://192.168.0.51/decoder_control.cgi?command="
var starting_preset 	= 31;
var incr_preset	 		= 2;

// dependencies
var request = require('request');
var program = require('commander');

program
 	.version('0.0.1')
	.option('-r, --random', 'Random preset choosing')
	.option('-t, --timeout <seconds>', 'Timeout between preset points.')
	.option('-p', '--preset <max>', 'Number of preset points')
	.parse(process.argv);


console.log('Starting patrol');
if (program.random) console.log('  randomly');
console.log("...")

var curr = 0;

while(true) {

	// TODO: randomize presets for less MIGUE
	curr++;

	if(curr > parseInt(program.preset))
		curr = 0;

	// force preset to be an int
	var n = parseInt(starting_preset + incr_preset * curr);

	// prepare request url
	var req_url = "" + host_url + n;

	// log what you're doing
	console.log("Calling preset number: " + n);

	// perform request
	request(req_url, function (error, response, body) {

		if (!error && response.statusCode == 200)
			console.log("Response: " + body) 

		else 
			console.log("ERROR: puts...");
	});
}