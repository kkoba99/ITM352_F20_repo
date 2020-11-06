var express = require('express');
var app = express();
var myParser = require("body-parser");

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
});

app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
   let POST = request.body;
   if(isNonNegIntString(POST['quantity_textbox'])) {
       response.send(`thank you for ordering ${POST['quantity_textbox']} items`);
   } else {
       response.send(`Hey! ${POST['quantity_textbox']}is not valid`);
   }
});

app.get('/hello.html', function (request, response, next) {
    response.send("got a get to /tests");
    next();
});

app.use(express.static('./public')); ///creates a middleware
app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here

function isNonNegIntString (string_to_check, returnErrors=false) {
    /*This fucntion return true if string_to_check is a non negative integer.
    If returnerror is true it will reutnr the array of reasons it is not a non-negative integer*/
    errors = []; // assume no errors at first
    if(Number(string_to_check) != string_to_check) {errors.push('Not a number!');} // Check if string is a number value
    else {
        if(string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
        if(parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer
    }
    return returnErrors ? errors : (errors.length == 0);
}
