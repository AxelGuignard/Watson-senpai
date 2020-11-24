let express = require("express");
let mysql = require("mysql");
require("ejs");
let app = express();
require("bootstrap");

app.listen(3000);
app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "watson_chat"
})

con.connect(function (err)
{
    if (err) throw err;
})

app.get("/", function (req, res)
{
    let messages = [];
    con.query("SELECT * FROM message", function(error, result, fields)
    {
        messages.push(result);
        console.log(messages[0]);
        res.render("index", {title: "Watson Senpai POC", messages: messages});
    });
});