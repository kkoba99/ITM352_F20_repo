var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
var data = require('./public/product_data.js');
var products = data.products;

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
});

app.use(myParser.urlencoded({ extended: true }));
app.post("/process_form", function (request, response) {
    process_quantity_form(request.body, response);
   });

function process_quantity_form (POST, response) {
    if (typeof POST['quantity_textbox'] != 'undefined') {
        let q = POST['quantity_textbox'];
        if (isNonNegInt(q)) {
            var contents = fs.readFileSync('./views/display_quantity_template.view', 'utf8');
            response.send(eval('`' + contents + '`')); // render template string
        } else {
            response.send(`${q} is not a quantity!`);
        }
    let model = products[0]['model'];
    let model_price = products[0]['price'];
    }
    };


app.get('/hello.html', function (request, response, next) {
    response.send("got a get to /tests");
    next();
});

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

app.use(express.static('./public')); ///creates a middleware
app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here
