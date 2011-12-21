/**
 * Chat Server
 * 
 * @author benn0r <admin@benn0r.ch>
 * @since 2011/12/20
 * @version 2011/12/20
 */

// Required modules
var http = require('http');
var sys = require('util');
var url = require('url');
var fs = require('fs');

var port = 1007; // server port
var clients = new Array(); // list with all connected clients
var messages = [];

var message = ''; // active message

http.createServer(function (request, response) {
	var urlparts = url.parse(request.url);
	//console.log(urlparts.pathname);
	
	switch (urlparts.pathname) {
		case '/client.html':
			fs.readFile('./client.html', function (err, data) {
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.end(data);  
			});

			break;
		case '/jquery.js':
			fs.readFile('./jquery.js', function (err, data) {
				response.writeHead(200, {'Content-Type': 'text/javascript'});
				response.end(data);  
			});

			break;
		case '/push':
			// very very hawt, yay
			message = urlparts.query.replace('message=', '');
			console.log('client pushed new message: ' + message);
			
			send();
			
			response.writeHead(200, {'Content-Type': 'text/plain'});
			response.end('thx\n');
			break;
		case '/fetch':
			// register client
			clients.push(response);
			console.log('client connected');
			break;
	}
}).listen(port);

/**
 * Sends a message to all connected clients and closes
 * all the connections
 */
function send() {
	for (var i = 0; i < clients.length; i++) {
		var client = clients[i];
		
		console.log('send message: ' + message);

		client.writeHead(200, {'Content-Type': 'text/plain'});
		client.end(message + '\n');
	}
	
	// @todo good or bad? maybe bad
	clients = new Array();
}

console.log('Server running at http://127.0.0.1:' + port + '/');