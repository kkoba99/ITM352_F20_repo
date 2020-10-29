var express = require('express');
var app = express();
app.all('*'), function (req, res, next) {
    console.log(req.method);
    next();
}
app.listen(8080);