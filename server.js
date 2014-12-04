// Load required modules
var http    = require("http");              // http server core module
var express = require("express");           // web framework external module
var io      = require("socket.io");         // web socket external module
var easyrtc = require("easyrtc");           // EasyRTC external module

// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var app = express();

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: false}));

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + "/static/"));

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/join', function(req, res) {
	var username = req.body.username;
	var roomname = req.body.roomname;

	res.render('room', {username: username, roomname: roomname});
});

// Start Express http server on port 8080
var webServer = http.createServer(app).listen(8080);

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {"log level":1});

// Start EasyRTC server
var rtc = easyrtc.listen(app, socketServer);
