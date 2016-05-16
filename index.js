var WebSocketServer = require("ws").Server
var http = require("http")
var $ = jQuery = require('jquery')
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))

app.get('/', function(req,res){
  res.redirect('roomselect.html');
});

app.get('/g2p', function(req, res){
  var gID = encodeURIComponent(Math.floor(Math.random() * (99999999 - 1111111)) + 1111111);
  games.push({'id': gID, 'ws': con});
  res.redirect('game2p.html?g=' + gID);
});

var server = http.createServer(app)
server.listen(port)

var games = [];

console.log("http server listening on %d", port)
var con;
var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
    con = ws;
    ws.send(JSON.stringify(new Date()), function() {  })
    ws.on("close", function() {
    console.log("websocket connection close")
  })
})
