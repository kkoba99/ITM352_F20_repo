var product_data = require('./public/product_data.js'); // This puts the product_data.js data into a variable called data 
var express = require('express'); 
var app = express(); //loads express into "var app"
var myParser = require("body-parser"); //loads body parser module in "var myParser"
const querystring = require('querystring'); //loads querystring module in "const querystring"
var fs = require('fs'); //loads file system module into "var fs"
var cookieParser = require('cookie-parser')
var session = require('express-session');
const user_data_filename = 'userdata.json';

app.use(session({secret: "ITM352 rocks!"})); // automatically sets up the use of sessions
app.use(cookieParser());
app.use(myParser.urlencoded({ extended: true }));
app.use(myParser.json());

if(fs.existsSync(user_data_filename)) {
    stats = fs.statSync(user_data_filename);
    console.log(`user_data.json has ${stats['size']} characters`);

    var data = fs.readFileSync(user_data_filename, 'utf-8');
    users_reg_data = JSON.parse(data);

}

app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);//type in console the request method and request path
    next(); //move on
});

app.post("/process_login", function (request, response) {
    console.log(request.body);
    if(typeof users_reg_data[request.body.username] != 'undefined') {
        if(request.body.password == users_reg_data[request.body.username].password) {
            // I want to put into the session that the user logged in, then redirect them to the index.html
            console.log(`You logged in. You're session id is ${request.session.id}`);//checking 
            
        } else {
            response.send(`Hey! ${request.body.password} doesn't match what we have for you!`)
        }
    } else {
    response.send(`Hey! ${user_data_filename} does not exist`);
}
});

app.post("/add_to_cart", function (request, response) {
    // When the user hits the "add to cart" button for a clothing product, this app.post will add the quantity data to the session object
    var POST = request.body
    console.log(POST);

    //check if quantity is valid, if so add to session, otherwise return error
    has_errors = false;



    if (has_errors == false) {
        if (typeof request.session.cart == 'undefined') {
            request.session.cart = {};
        }
        if (typeof request.session.cart[POST.product_key] == 'undefined') {
            request.session.cart[POST.product_key] = [];
        }
        request.session.cart[POST.product_key][POST.product_index] = Number.parseInt(POST.quantity);
        response_msg = `Added ${POST.quantity} to your cart!`;
    }
    response_msg = `Added ${POST.quantity} to your cart!`;
    console.log(request.session);
    response.json({"message":response_msg});
    
});

app.post("/get_cart_data", function (request, response) {
    if (typeof request.session.cart == 'undefined') {
        request.session.cart = {};
    }
    response.json(request.session.cart);
});















 //Modified from ITM352 Lab12, checks for invalid quantities
 function isNonNegIntString(string_to_check, returnErrors = false) {
    errors = []; // assume no errors at first
    if (Number(string_to_check) != string_to_check) { errors.push('<font color = "red">Not a number!</font color = "red">'); } // Check if quantity is a number
    else { //If it is a number, move on to do other checks
        if (string_to_check < 0) { errors.push('<font color = "red">Negative value!</font color = "red">'); } // Check if quantity is a non-negative
        if (parseInt(string_to_check) != string_to_check) { errors.push('<font color = "red">Not an integer!</font color = "red">'); } // Check if quantity is a non-integer
    }
    return returnErrors ? errors : (errors.length == 0); // If no errors, do not show "invalid quantity" text 
}

//Modified from ITM352 Lab12, shows errors next to quantity textbox if there are invalid quantities entered
function checkQuantityTextbox(theTextbox) {
    errs = isNonNegIntString(theTextbox.value, true);
    if (errs.length == 0) errs = ['You want:']; //If there's no errors, replace "Quantity" with "You want:" text
    if (theTextbox.value.trim() == '') errs = ['Quantity'];
    document.getElementById(theTextbox.name + '_label').innerHTML = errs.join(" "); // Show errors if there's invalid quantities 
}


app.use(express.static('./public')); //Searchs for files in the public directory 
app.listen(8080, () => console.log(`listening on port 8080`)); // starts listening for requests on port 8080