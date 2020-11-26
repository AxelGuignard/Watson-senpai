const express = require("express");
const mysql = require("mysql");
const speechToTextV1 = require("ibm-watson/speech-to-text/v1");
const { IamAuthenticator } = require('ibm-watson/auth');
const Mic = require("mic");
const bodyParser = require("body-parser");
// const io = require("socket.io")(server);
require("sox");
require("ejs");
require("tough-cookie");

let app = express();
let mic = Mic({
    rate: 16000,
    channels: 1,
    debug: true
});

let micInputStream = mic.getAudioStream();

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connection to database
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

// Initializing speech recognition
let speechToText = new speechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: 'cProsSxWgkFSWTWkH2bTDU_YmSa1linjUEL5-5lB6mPn',
    }),
    serviceUrl: 'https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/aab5652c-8a5c-4e84-997d-0809f6f3abad'
});

let params = {
    objectMode: true,
    model: 'en-US_BroadbandModel',
    contentType: 'application/octet-stream',
    keywords: ["used to"],
    keywordsThreshold: 0.5
}

function onEvent(name, event) {
    console.log(name, JSON.stringify(event, null, 2));
}

micInputStream.on('stopComplete', function() {
    console.log("Got SIGNAL stopComplete");
});

micInputStream.on('startComplete', function() {
    console.log("Got SIGNAL startComplete");
});

app.post("/", function (req, res, next)
{
    if (req.body.mic === "on")
    {
        let recognizeStream = speechToText.recognizeUsingWebSocket(params);
        micInputStream.pipe(recognizeStream);
        recognizeStream.on('data', function(event) {
            let now = new Date();
            con.query("INSERT INTO message (user_id, content, date) VALUES (2, ?, ?)", [event.results[0].alternatives[0].transcript, now], function (error, result, fields) {

            });
            if (event.results.length > 0)
                res.send({
                    result: event.results[0].alternatives[0].transcript,
                    keywords_result: event.results[0].keywords_result
                });
        });
        mic.start();
    }
    else if (req.body.mic === "off")
    {
        mic.stop();
    }
});

// Render index when accessing root
app.get("/", function (req, res)
{
    let messages = [];
    con.query("SELECT * FROM message", function(error, result, fields)
    {
        messages.push(result);
        res.render("index", {title: "Watson Senpai POC", messages: messages});
    });
});

app.listen(3000);