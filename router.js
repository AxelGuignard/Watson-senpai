let express = require("express");
require("twig");
let app = express();

app.listen(3000);
app.set("view engine", "twig");

app.get("/", function (req, res)
{
    res.render("index", {title: "Watson Senpai POC"});
});