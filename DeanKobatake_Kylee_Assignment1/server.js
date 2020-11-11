//Assignment 1, Kylee Dean-Kobatake
//Below is code extracted from Lab13, excercise 4 with slight modifications

var express = require('express');
var app = express();
var myParser = require("body-parser");
var data = require('./public/product_data.js');
var products = data.products;
var fs = require('fs');

// From Lab13, excercise 4
app.use(express.static('./public')); 
app.use(myParser.urlencoded({ extended: true }));
 
//I think this function from Lab13 takes the quantity information inputted by the customer and delivers it to the invoice(?). 
function process_quantity_form (POST, response) {
        if (typeof POST['purchase_submit_button'] != 'undefined') {
           var contents = fs.readFileSync('./views/display_quantity_template.view', 'utf8');
           receipt = '';
            for(i in products) { 
                let q = POST[`quantity_textbox${i}`];
                let item = products[i]['item'];
                let item_price = products[i]['price'];
                if (isNonNegIntString(q)) {
                receipt += eval('`' + contents + '`'); 
                } else {
                receipt += `<h3><font color="red">${q} is not a valid quantity for ${item}!</font></h3>`; // If no quantity or an invalid quantity is selected, this pops up
                }
            }
          response.send(receipt);
          response.end();
        }
     }

//Originally from Lab12, this functions checks for invalid data quantities
function isNonNegIntString (string_to_check, returnErrors=false){
    errors = []; // assume no errors at first
    if(Number(string_to_check) != string_to_check) {errors.push('Not a number!');} // Check if string is a number value
    if(string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer
    
    return returnErrors ? errors : (errors.length == 0);
}

// From Lab13, excercise 4
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

// From Lab13, excercise 4
app.post("/process_form", function (request, response) {
    let POST = request.body;
    process_quantity_form(POST, response);
});

// From Lab13, excercise 4
app.listen(8080, () => console.log(`listening on port 8080`)); 
