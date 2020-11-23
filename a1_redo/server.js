//Code below is from Lab13, exercise 2
var express = require('express');
var app = express();
var myParser = require("body-parser");//Lab13, exercise 3

//Code below is from Lab13, exercise 2
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});

//Code below from lab13, exercise 3
app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
   let POST = request.body;
   response.send(POST); 
});




//Code below is from Lab12, exercise 2
app.listen(8080, () => console.log(`listening on port 8080`));