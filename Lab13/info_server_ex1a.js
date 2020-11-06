const { timeStamp } = require('console');

//Access code from a node package throught the require() function
var express = require('express');
//With a reference to express, you can then create an express "app"
var app = express();


app.all('*', function (request, response, next) {
    response.send(request.method + ' to ' + request.path);
});
app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here