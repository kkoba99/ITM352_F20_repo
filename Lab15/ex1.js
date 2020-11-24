//enables cookies
var cookieParser = require('cookie-parser');
app.use(cookieParser());

//check if file exists before reading
if(fs.existsSync(user_data_filename)) {
    stats=fs.statSync(user_data_filename);
    console.log("user_data.json has ${stats} characters");

    var data = fs.readFileSync(user_data_filename, 'utf-8');
    users_reg_data = JSON.parse(data);
    // add new user
    username = 'newuser';
    users_reg_data[username] = {};
    users_reg_data[username].password = 'newpass';
    users_reg_data[username].email = 'newuser@user.com';
    //write updated object to user_data_filename
    reg_info_str = JSON.stringify(users_reg_data);
    fs.writeFileSync(user_data_filename, reg_info_str);

}

app.use(myParser.urlencoded({ extended: true }));

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="process_login" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

app.post("/process_login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(request.body);
    //if user exists, get their password
    if(typeof users_reg_data[request.body.username] != 'undefined') {
        if(request.body.password == users_reg_data[request.body.username].password) {
            response.send(`Thank you ${request.body.username} for logging in`);
        }
    } else {
    console.log(`ERR: ${user_data_filename} does not exist`);
}
});

app.listen(8080, () => console.log(`listening on port 8080`));
