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

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
    ws.send(JSON.stringify(new Date()), function() {  })
    ws.on("close", function() {
    console.log("websocket connection close")
  })
})
