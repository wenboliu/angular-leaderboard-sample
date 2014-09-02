var connect = require('connect');
connect.createServer(
    connect.static("../angular-leaderboard-sample")
).listen(5000);
