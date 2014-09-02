var connect = require('connect');
var http = require('http');
var app = connect();
app.use('/', connect.static("."));
app.use(function (request, response, next) { //root dir
    if ('/api' != request.url) return next();
    http.get({
        path: 'http://material-code.appspot.com/test/api'
    }, function (res) {
	    
        res.on("data", function (chunk) {
            response.end(chunk)
        });
	if(res.statusCode == 500) {
	    response.writeHead(500, '', {'content-type' : 'text/plain'});
	}
    });

});

var port = process.env.PORT || 5000;

connect.createServer(
    app
).listen(port);

console.log("server is running in port " + port);
