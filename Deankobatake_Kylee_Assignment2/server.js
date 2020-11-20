//Assignment 2, Kylee Dean-Kobatake
//Below is code extracted from Lab13, excercise 4 with slight modifications
//Big thanks to Professor Port for the guidance he provided 

//Below is code copied from Lab13
var data = require('./public/product_data.js'); // This puts the product_data.js data into a variable called data 
var products = data.products; // This puts the product data into a variable called products
const querystring = require('querystring'); //loads the querystring module in variable querystring
var express = require('express'); // Starts express
var app = express(); // Puts express in variable app
var myParser = require("body-parser"); //loads body-parser module in variable myParser
const { response } = require('express');
var fs = require('fs');

// catches all incoming requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);//type in console the request method and request path
    next(); //move on
});

app.use(myParser.urlencoded({ extended: true }));

//Code below was made with guidance from Professor Port
app.post("/process_quantities", function (request, response) {
    var POST = request.body;//put quantity_form POST data into variable called POST

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
        var stringified = querystring.stringify(POST);
        if (hasqty == true && hasErrors == false) {
            console.log(stringified);
            response.redirect("./user_login.html?" + stringified);
        }
        else { //if no quantity inputted or invalid, notify user and send them back to display
            alertstr = `<script> alert("Error! You need to select a item or enter valid quantities");
                        window.history.back() </script>`;

            response.send(alertstr);
        }
    }
});

const user_data_filename = 'userdata.json'; // assign userdata.json to user_data_filename
var data = fs.readFileSync(user_data_filename, 'utf-8'); // reads the data in user_data_filename and puts it into data variable
users_data = JSON.parse(data); // parses data variable into JSON them passes it into users_reg_data

//This takes the login info from login_form on user_login.html, checks if user exists in userdata.json, if they do then redirect to invoice. 
app.post("/process_login", function (request, response) {

    //var purchase_qty = querystring.stringify(request.body);

    if (typeof users_data[request.body.username] != 'undefined') { //if username matches stored username in userdata.json
        if (request.body.password == users_data[request.body.username].password) { //if the password matches the stored password
            // POST = request.body;
            // var qs = request.stringified;
            // console.log(qs);
            //response.redirect('/invoice.html?' + querystring.stringify(request.query)); 
            //console.log(purchase_qty); 
            alertstr = `<script> alert("Success! You can now complete your order."); 
           window.location.href ="invoice.html" </script>`; //display this message if successful login
            response.redirect("./invoice.html"); // then redirect to invoice
            response.send(alertstr);// send alert
        }
    } else { // if the username/password doesn't match, display this message alert and go back to login page
        alertstr = `<script> alert("User does not exist! Please register.");
        window.history.back() </script>`;

        response.send(alertstr); // send alert
    }

});



//This processes registration info, if data is valid then write data to file, then redirect to invoice
app.post("/process_register", function (request, response) {
    let POST = request.body;
    var errors = [];

    //code below checks if valid registration data is entered 
    //username validation
    if (request.body.newuser.length < 4) {
        errors.push("User name is too short!");
    };
    if (request.body.newuser.length > 25) {
        errors.push("User name is too long!");
    };
    if ((/^[0-9a-zA-Z]+$/).test(request.body.newuser) == false) { // got the (/^[0-9a-zA-Z]+$/) from w3resource.com
        errors.push("User name can only contain letters or numbers!");
    };
    //full name validation
    if (request.body.newfullname.length > 30) {
        errors.push("Name is too long!");
    };
    if ((/^[a-z]+[' ']+[A-Z]+$/).test(request.body.newfullname) == false) {
        errors.push("Name can only contain letters!");
    };
    //password validation
    if (request.body.newpass.length < 6) {
        errors.push("Password is too short!");
    };
    //confirm password validation
    if (request.body.newpass != request.body.newpass_confirm) {
        errors.push("Password confirmation does not match!");
    };

    // IGNORE THE CODE BELOW, WIP
    //email validation (modified from w3resource)
    //if ((/^[a-zA-Z0-9._]+[@]+[a-zA-Z0-9.]+[.]+[a-zA-Z]+*$/).test(request.body.newemail) == false) {
    // errors.push("Email is invalid!");
    //}
    // IGNORE THE CODE ABOVE, WIP

    if (errors.length == 0) { //if there's no errors in registration data validation

        //send data to userdata.json to be stored
        username = POST['newuser'];
        users_data[username] = {};
        users_data[username].name = POST['newfullname'];
        users_data[username].password = POST['newpass'];
        users_data[username].email = POST['newemail'];
        reg_info_str = JSON.stringify(users_data); //parse and store new user data in reg_info_str
        fs.writeFileSync(user_data_filename, reg_info_str); // write to userdata.json file
        alertstr = `<script> alert("Success! You can now complete your order.");
    window.location.href ="invoice.html"</script>`; //display successful alert and redirect to invoice.html

        response.send(alertstr);//send alert

    } else { // if there's a problem, display this alert and go back to login page
        alertstr = `<script> alert("There seems to be a registration error");
        window.history.back() </script>`;

        response.send(alertstr);//send alert
    }
});

// IGNORE THE CODE BELOW, WIP

//this needs to make sure that there's no empty user/name/pass/email is submitted.
/*let POST = request.body;
if (POST['newuser'] == [" "]) {
    alertstr = `<script> alert("Oops! You need to finish filling out the form!");
    window.history.back() </script>`;

    response.send(alertstr); // if there's a empty value, send alert and send back 
} else {
    response.redirect("./invoice.html"); // if registration is good, send to invoice
};*/


//function to check if user exists in user_data.json file
/*function does_user_exist() {
    let check_for_user = fs.readFileSync(user_data.JSON, 'utf-8');
    console.log(check_for_user);
};*/

// IGNORE THE CODE ABOVE, WIP

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