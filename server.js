var connect = require('connect');
var http = require('http');
var app = connect();
app.use('/public', connect.static("../angular-leaderboard-sample"));
app.use(function (request, response, next) { //root dir
    if ('/api' != request.url) return next();
    http.get({
        host: '10.18.0.254',
        port: 3128,
        path: 'http://material-code.appspot.com/test/api'
    }, function (res) {
        res.on("data", function (chunk) {
            response.end(chunk)
        });
    });

});

var port = 5000;
connect.createServer(
    app
).listen(port);

console.log("server is running in port " + port);
