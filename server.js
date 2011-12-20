var http = require('http');
var sys = require('util');
var url = require('url');

var port = 1005;
var clients = [];
var messages = [];

var message = '';

http.createServer(function (request, response) {
	var urlparts = url.parse(request.url);
	console.log(urlparts.pathname);
	
	switch (urlparts.pathname) {
		case '/push':
			// very very hawt, yay
			message = urlparts.query.replace('message=', '');
			console.log('pushed new message: ' + message);
			
			send();
			
			response.writeHead(200, {'Content-Type': 'text/plain'});
			response.end('thx\n');
			break;
		case '/fetch':
			clients.push(response);
			console.log('client connected');
			break;
	}
}).listen(port);

function send() {
	for (var i = 0; i < clients.length; i++) {
		var client = clients[i];

		client.writeHead(200, {'Content-Type': 'text/plain'});
		client.end(message + '\n');
	}
}

console.log('Server running at http://127.0.0.1:' + port + '/');