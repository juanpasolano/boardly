// Import third-party libraries (managed by npm)
var express = require('express');
var http = require('http');
var RethinkdbWebsocketServer = require('rethinkdb-websocket-server');

// Set up an HTTP route to serve files from assets/
var app = express();
app.use('/', express.static('build'));
var httpServer = http.createServer(app);


RethinkdbWebsocketServer.listen({
	httpServer: httpServer,
	httpPath: '/db',
	dbHost: 'localhost',
	dbPort: 28015,
	unsafelyAllowAnyQuery: true,
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});



httpServer.listen(8015);
console.log('Tutorial server started');
