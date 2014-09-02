var fs = require("fs");
var host = "127.0.0.1";
var port = 1337;
var express = require("express");

var app = express();
var http = require('http');

app.get("/api", function(request, response){ //root dir
    http.get ({
    host: '10.18.0.254',
    port: 3128,
    path: 'http://material-code.appspot.com/test/api'
}, function (res) {
    res.on("data", function(chunk){
        response.send(chunk)
    });
});

});

app.listen(port, host);
