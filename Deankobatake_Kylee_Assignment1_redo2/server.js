//Assignment 1, Kylee Dean-Kobatake
//Below is code extracted from Lab13, excercise 4 with slight modifications
//Big thanks to Professor Port for the guidance he provided 

//Below is code copied from Lab13
var data = require('./public/product_data.js'); // This puts the product_data.js data into a variable called data 
var products = data.products; // This puts the product data into a variable called products
const querystring = require('querystring'); //loads the querystring module in variable querystring
var express = require('express'); // Starts express
var app = express(); // Puts express in variable app
var myParser = require("body-parser"); //loads body-parser module in variable myParser

// catches all incoming requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);//type in console the request method and request path
    next(); //move on
});

app.use(myParser.urlencoded({ extended: true }));

//Code below was made with guidance from Professor Port
app.post("/process_quantities", function (request, response) {
    let POST = request.body;//put quantity_form POST data into variable called POST
    
    if (typeof POST['submitPurchase'] != 'undefined') {
        
        let hasqty = false;
        let hasErrors = false; // assume no errors to begin with
        //validate each quantity 
        for (i in products) { 
            qty = POST[`quantity${i}`];
            //check if quantity is non negative integer
            if (qty != '' && isNonNegIntString(qty) == false) {
                hasErrors = true;
            }
            //check to see if user selected any quantities
            if (qty > 0) {
                hasqty = true;
            }
        }
        //if no errors, send quantity data to invoice, otherwise go back to display page
        const stringified = querystring.stringify(POST);
        if (hasqty == true && hasErrors == false) {
            response.redirect("./invoice.html?" + stringified);
        }
        else { //if no quantity inputted or invalid, notify user and send them back to display
            alertstr = `<script> alert("Error! You need to select a item or enter valid quantities");
                        window.history.back() </script>`;
            
            response.send(alertstr);
         }
    } 
});

//Function below is from ITM352 Lab12, checks if quantities entered are a number, non-negative, and an integer
function isNonNegIntString(string_to_check, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(string_to_check) != string_to_check) { errors.push('Not a number!'); } // Check if string is a number value
    if (string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer

    return returnErrors ? errors : (errors.length == 0);
}


app.use(express.static('./public')); //Searchs for files in the public directory 
app.listen(8080, () => console.log(`listening on port 8080`)); // starts listening for requests on port 8080