var product_data = require('./public/product_data.js'); // This puts the product_data.js data into a variable called data 
var express = require('express'); 
var app = express(); //loads express into "var app"
var myParser = require("body-parser"); //loads body parser module in "var myParser"
const querystring = require('querystring'); //loads querystring module in "const querystring"
var fs = require('fs'); //loads file system module into "var fs"
var cookieParser = require('cookie-parser')
var session = require('express-session');
const user_data_filename = 'userdata.json';
const nodemailer = require("nodemailer");
const { send } = require('process');

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
    POST = request.body;
    if(typeof users_reg_data[request.body.username] != 'undefined') {
        if(request.body.password == users_reg_data[request.body.username].password) {
            if (typeof request.session.login == 'undefined') {
                request.session.login = {};
            }
            if (typeof request.session.login.username == 'undefined') {
                request.session.login.username = [POST.username];
            }
            if (typeof request.session.login.password == 'undefined') {
                request.session.login.password = [POST.password];
            }
          console.log(request.session);

          var user_email = users_reg_data[request.body.username].email;

          response.cookie('username', POST.username);
          response.cookie('email', user_email);
          response.redirect("./login.html");
  

        } else {
            response.send(`Hey! ${request.body.password} doesn't match what we have for you!`)
        }
    } else {
    response.send(`Hey! ${user_data_filename} does not exist`);
}
});



app.post("/process_registration", function (request, response) {

    let POST = request.body;
    var errors = [];


    //username validation
    if (typeof   users_reg_data[request.body.newuser.toLowerCase] != 'undefined') { // if username exists in userdata.json
        errors.push("Username exists");
    }

    if (request.body.newuser.length < 4) { //if username is less than four characters long
        errors.push("Username is too short");
    }

    if (request.body.newuser.length > 25) { //if username is more than 25 characters long
        errors.push("Username is too long");
    }

    if ((/^[0-9a-zA-Z]+$/).test(request.body.newuser) == false) { // got the (/^[0-9a-zA-Z]+$/) from w3resource.com
        errors.push("Username can only contain letters or numbers"); // if username has characters other than letters/numbers
    }

    //full name validation
    if (request.body.newfullname.length > 30) { //if full name is more than 25 characters long
        errors.push("Name is too long");
    }

    if (/^[A-Za-z]+$/.test(request.body.name)) { //(code from Justina) if full name contains characters beside letters
    } else {
        errors.push("Name can only contain letters");
    }

    //password validation
    if (request.body.newpass.length < 6) { //if password is less than six characters long
        errors.push("Password is too short");
    }

    //confirm password validation
    if (request.body.newpass != request.body.newpass_confirm) { //if password confirm does not match password
        errors.push("Password confirmation does not match");
    }

    if (errors.length == 0) { //if there's no errors in registration data validation
        let POST = request.body;

        //send data to userdata.json to be stored
        username = POST['newuser'];
          users_reg_data[username] = {};
          users_reg_data[username].name = POST['newfullname'];
          users_reg_data[username].password = POST['newpass'];
          users_reg_data[username].email = POST['newemail'];
        reg_info_str = JSON.stringify(users_reg_data); //parse and store new user data in reg_info_str
        fs.writeFileSync(user_data_filename, reg_info_str, "utf-8");// write to file

            response.cookie('username', POST['newuser']);
            response.cookie('email', POST['newemail']);

            alertstr = `<script> alert("Thank you for registering! Please login to continue shopping.");
                        window.history.back() </script>`;

            response.send(alertstr); // send alert
            //response.redirect("./index.html"); // redirect to invoice with the two strings
    } else {
        alertstr = `<script> alert("Error! ${errors}.");
                        window.history.back() </script>`;

            response.send(alertstr); // send alert
    }
});







app.post("/add_to_cart", function (request, response) {
    // When the user hits the "add to cart" button for a clothing product, this app.post will add the quantity data to the session object
    var POST = request.body
    console.log(POST);

    //check if quantity is valid, if so add to session, otherwise return error
    
    has_errors = false;
    qty = POST[`quantity`];
    if (qty != '' && isNonNegIntString(qty) == true) {


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

} else {

        has_errors = true;
        console.log("errors");
        ;
        
    };
   
    
});




app.post("/get_cart_data", function (request, response) {
    if (typeof request.session.cart == 'undefined') {
        request.session.cart = {};
    }
    response.json(request.session.cart);
});

app.post("/get_login_data", function (request, response) {
    if (typeof request.session.login == 'undefined') {
        request.session.login = {};
        console.log(request.session.login)
    }
    response.json(request.session.login);

});



app.post("/go_to_invoice", function (request, response) {
    console.log(request.session.cart);

    if (typeof request.session.login == 'undefined') {
        alertstr = `<script> alert("Please login or register to complete purchase!");
                        window.history.back() </script>`;

            response.send(alertstr);
           
        
    }
    //If logged in, let person go to invoice. If not, notify they need to log in.
    response.redirect("./invoice.html")
});

//code from assignment 3 examples from Professor Port
app.post("/complete_order", function (request, response) {
    var user_email = request.cookies.email;
    var invoice_str = `Thank you for buying from Heart Depot,${user_email} ! Your order will be shipped by the next business day`;

    //copied from port's example
    var shopping_cart = request.session.cart;
    for(product_key in product_data) {
        for(i=0; i<product_data[product_key].length; i++) {
            if(typeof shopping_cart[product_key] == 'undefined') continue;
            qty = shopping_cart[product_key][i];
            if(qty > 0) {
              invoice_str += `<tr><td>${qty}</td><td>${product_data[product_key][i].name}</td><tr>`;
            }
        }
    }
      invoice_str += '</table>';

   
    var transporter = nodemailer.createTransport({
        host: "mail.hawaii.edu",
        port: 25,
        secure: false, // use TLS
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        }
      });
    
      var user_email = request.cookies.email;
      console.log(user_email);
      var mailOptions = {
        from: 'kkak@hawaii.edu',
        to: user_email,
        subject: 'Your Invoice',
        html: invoice_str
      };
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            invoice_str += '<br>There was an error and your invoice could not be emailed :(';
        } else {
            invoice_str += `<br>Your invoice was mailed to ${user_email}`;
        }
        response.send(invoice_str);
      });
})




//code borrowed from ALyssa Mencel's Assignmetn 3 server.js
app.post('/logout', function (request, response) { 
    request.session.destroy(); 
    response.clearCookie("username");
    response.clearCookie("email");
    response.redirect('/index.html');

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