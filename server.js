var connect = require('connect');
var http = require('http');
var fs = require('fs');

var app = connect();

app.use('/', connect.static("."));
app.use(function (request, response, next) {
    if ('/api' != request.url) return next();
    http.get('http://material-code.appspot.com/test/api', function (res) {
        res.on("data", function (chunk) {
            if(chunk.toString().indexOf("first_name") >= 0) {
                response.end(chunk);
                fs.writeFile('./cache/cache.json', chunk, function (err) {
                    if (err) {
                        console.log("write [./cache/cache.json] failed!" + err);
                    } else {
                        console.log("yeah!");
                    }
                });
            }
            else{
                fs.readFile('./cache/cache.json', function (err, data) {
                    if (err){
                        console.log("read [./cache/cache.json] failed!" + err);
                    }else {
                        response.end(data);
                    }
                })
            }
        });
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
        response.writeHead(500, '', {'content-type': 'text/plain'});
    });

});

var port = process.env.PORT || 5000;

connect.createServer(
    app
).listen(port);

console.log("server is running in port " + port);