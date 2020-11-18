
var data = require('./public/product_data.js'); // This gets the product data from the product_data.js file
var products_array = data.products; // This puts the product data into an array called "products_array"
const querystring = require('querystring'); 
var express = require('express'); // Starts express
var app = express(); // Puts express in app
var myParser = require("body-parser"); 

app.all('*', function (request, response, next) { 
    console.log(request.method + ' to ' + request.path); 
    next(); 
});

app.use(myParser.urlencoded({ extended: true })); 


app.post("/process_form", function (request, response) { 
    
    console.log(request.body[``]);
});

function isNonNegIntString (string_to_check, returnErrors=false){
    errors = []; // assume no errors at first
    if(Number(string_to_check) != string_to_check) {errors.push('Not a number!');} // Check if string is a number value
    if(string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer
    
    return returnErrors ? errors : (errors.length == 0);
}


app.use(express.static('./public')); //Searchs for files in the public directory 
app.listen(8080, () => console.log(`listening on port 8080`)); // starts listening for requests on port 8080