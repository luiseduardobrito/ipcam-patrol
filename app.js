#!/usr/bin/env node

// defines
var host_url 			= "http://192.168.0.51/"
var starting_preset 	= 31;
var incr_preset	 		= 2;

// auth
var user = "admin"
var pass = "ipcam"

// dependencies
var request = require('request');
var program = require('commander');

var Patrol = function() {

	var exports = {};
	var curr = 0;
	var working = false;

	function start() {

		var welcome_msg = 'Starting patrol';

		if (program.random) 
			welcome_msg += ' randomly';

		console.log(welcome_msg + "...")

		if(!program.timeout || !parseInt(program.timeout))
			program.timeout = 10;

		working = true;

		setInterval(function(){
			if(working)
				next();
		}, program.timeout * 1000);

	}; exports.start = start;

	function next() {

		if(curr >= parseInt(program.preset))
			curr = 0;

		// force preset to be an int
		var n = parseInt(starting_preset + incr_preset * curr);

		// prepare request url
		var req_url = host_url + "decoder_control.cgi?command=" + n;

		// log what you're doing
		console.log("Calling preset number: " + n);

		// perform request
		request.get({
			'auth': {
				'user': user,
				'pass': pass
			},

			'url' : req_url
		}, function (error, response, body) {

			if (!error && response.statusCode == 200)
				console.log("Response: " + body) 

			else {
				console.log(error);
				console.log(response);
				console.log(body);
			}

			// TODO: randomize presets for less MIGUE
			curr++;
		});

	}

	function stop() {

		console.log("Stopping patrol...");
		working = false;

		setTimeout(function(){

			console.log("Patrol stopped successfully");

		}, program.timeout * 1000);

	}; exports.stop = stop;

	function init() {

		program
 			.version('0.0.1')
			.option('-r, --random', 'Random preset choosing')
			.option('-t, --timeout <seconds>', 'Timeout between preset points.')
			.option('-p, --preset <max>', 'Number of preset points')
			.parse(process.argv);

		// auth
		request.get(host_url).auth(user, pass);

		return exports;
	};

	return init();
}

var patrol = new Patrol();
patrol.start();