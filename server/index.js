// Import third-party libraries (managed by npm)
var express = require('express');
var http = require('http');
var RethinkdbWebsocketServer = require('rethinkdb-websocket-server');

// Set up an HTTP route to serve files from assets/
var app = express();
app.use('/', express.static('assets'));
var httpServer = http.createServer(app);


RethinkdbWebsocketServer.listen({
	httpServer: httpServer,
	httpPath: '/db',
	dbHost: 'localhost',
	dbPort: 28015,
	unsafelyAllowAnyQuery: true,
});



httpServer.listen(8015);
console.log('Tutorial server started');
