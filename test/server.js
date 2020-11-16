
var express = require('express');
var app = express();
var myParser = require("body-parser");
var data = require('./public/product_data.js');
var products = data.products;


app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));
 

app.post("/process_form", function (request, response) {
    let POST = request.body;
    let item = products[0]['item'];
    let price = products[0]['price'];
    if (typeof POST['purchase_submit_button'] != 'undefined') {
        qty = POST['quantity_textbox'];
        response.send(`thanks for ordering ${qty} things ${item}`);
    // response.redirect("./invoice.html");
    } else {
    response.send("Enter Valid Quantity!");
    }
});


function isNonNegIntString (string_to_check, returnErrors=false){
    errors = []; // assume no errors at first
    if(Number(string_to_check) != string_to_check) {errors.push('Not a number!');} // Check if string is a number value
    if(string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}



app.use(express.static('./public')); 
app.listen(8080, () => console.log(`listening on port 8080`)); 
