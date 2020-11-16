//Assignment 1, Kylee Dean-Kobatake
//Below is code extracted from Lab13, excercise 4 with slight modifications
//Got help from Professor Port and Justina Bui from ITM352

//Below is code copied from Lab13, with additional help from Justina Bui in ITM352
var data = require('./public/product_data.js'); // This gets the product data from the product_data.js file
var products_array = data.products; // This puts the product data into an array called "products_array"
const querystring = require('querystring'); 
var express = require('express'); // Starts express
var app = express(); // Puts express in app
var myParser = require("body-parser"); 

app.all('*', function (request, response, next) { 
    console.log(request.method + ' to ' + request.path); 
    next(); //go ahead to the next thing
});

app.use(myParser.urlencoded({ extended: true })); 

//Code below is referenced from Justina Bui in ITM352
app.post("/process_form", function (request, response) { 
    let POST = request.body;

    if (typeof POST['submitPurchase'] != 'undefined') {
        response.send("Invalid Entry!");
    }
    let validQuantities = []; 
    let hasErrors = false;
    for (i in products) {
        qty = POST[`quantity${i}`];
        if (qty != '' || qty > 0) validQuantities.push(isNonNegInt(qty)); 
    }
    hasErrors = validQuantities.includes(false);
    const stringified = querystring.stringify(POST);
    if (validQuantities.length != 0 && !hasErrors) {
        response.redirect("./invoice.html?" + stringified);
    }
    else { response.send('Enter a valid quantity!') } 
});
//Code above is referenced from Justina Bui in ITM352

//Function below is from ITM352 Lab12, checks if quantities entered are a number,non-negative, and an integer
function isNonNegIntString (string_to_check, returnErrors=false){
    errors = []; // assume no errors at first
    if(Number(string_to_check) != string_to_check) {errors.push('Not a number!');} // Check if string is a number value
    if(string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer
    
    return returnErrors ? errors : (errors.length == 0);
}

//
app.use(express.static('./public')); //Searchs for files in the public directory 
app.listen(8080, () => console.log(`listening on port 8080`)); // starts listening for requests on port 8080