var express = require('express');
var app = express();
var myParser = require("body-parser");
const fs = require('fs'); //require fs package

const user_data_filename = 'userdata.json';

if(fs.existsSync(user_data_filename)) {
    stats=fs.statSync(user_data_filename);
    console.log(stats);

    var data = fs.readFileSync(user_data_filename, 'utf-8');
    users_reg_data = JSON.parse(data);
    if(typeof users_reg_data['itm352'] != 'undefined') {
        console.log(users_reg_data['itm352']['password']=='xxx');
    }
    } else {
    console.log(`ERR: ${user_data_filename} does not exist`);
}

app.use(myParser.urlencoded({ extended: true }));

app.post("/login", function (request, response) {
    // Give a simple login form
    str = `
<body>
<form action="" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
    response.send(str);
 });

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log(reguest.body)
});

app.listen(8080, () => console.log(`listening on port 8080`));

console.log(users_reg_data["itm352"]);