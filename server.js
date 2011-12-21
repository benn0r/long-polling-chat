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
var crypto = require('crypto');
var qs = require('querystring');

var port = 80; // server port
var clients = []; // list with all connected clients
var messages = [];
var users = [];

http.createServer(function (request, response) {
	var urlparts = url.parse(request.url, true);
	//console.log(urlparts.pathname);
	
	switch (urlparts.pathname) {
		/**
		 * Called form client with parameter "username"
		 * Returns an unique md5 hash
		 */
		case '/register':
			// generate very unique hash for the user
			var hash = crypto.createHash('md5');
			hash.update(urlparts.query['username']);
			var md5 = hash.digest('hex');
			
			response.writeHead(200, {'Content-Type': 'text/plain'});
			
			response.end(md5); // send hash to client
			users[md5] = urlparts.query['username']; // save hash for later use
			break;
		case '/push':
			var message = '{"user":"' + users[urlparts.query['user']] + '","message":"' + urlparts.query['message'] + '"}';
			console.log('client pushed new message: ' + message);
			
			for (var i = 0; i < clients.length; i++) {
				var client = clients[i];
				client.messages.push(message);
			}
			
			response.writeHead(200, {'Content-Type': 'text/plain'});
			response.end('thx\n');
			
			send();
			break;
		case '/fetch':
			// client is waiting for messages
			
			var client = null;
			for (var i = 0; i < clients.length; i++) {
				if (clients[i].hash == urlparts.query['user']) {
					client = clients[i];
					clients[i].response = response;
				}
			}
			
			if (client == null) {
				client = new Object();
				client.hash = urlparts.query['user'];
				client.response = response;
				client.messages = new Array();
				
				clients.push(client);
			}
			
			console.log('client waiting for messages');
			break;
		default:
			// check if file exists
			fs.readFile('./client' + urlparts.pathname, function (err, data) {
				if (!err) {
					if (urlparts.pathname.indexOf('.js') != -1) {
						response.writeHead(200, {'Content-Type': 'text/javascript'});
					} else if (urlparts.pathname.indexOf('.html') != -1) {
						response.writeHead(200, {'Content-Type': 'text/html'});
					} else if (urlparts.pathname.indexOf('.css') != -1) {
						response.writeHead(200, {'Content-Type': 'text/stylesheet'});
					}
					response.end(data);
				} else {
					response.writeHead(404, {'Content-Type': 'text/html'});
					response.end('404 NOT FOUND');
				}
			});
		
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
		
		if (client.response != null) {
			var answer = '';
			for (var j = 0; j < client.messages.length; j++) {
				answer = answer + client.messages[j] + '\n';
			}

			client.response.writeHead(200, {'Content-Type': 'text/plain'});
			client.response.end(answer + '\n');
			
			// reset messages and response
			client.messages = new Array();
			client.response = null;
		}
	}
}

console.log('Server running at http://127.0.0.1:' + port + '/');