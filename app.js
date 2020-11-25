const express = require("express");
const mysql = require("mysql");
const speechToTextV1 = require("ibm-watson/speech-to-text/v1");
const { IamAuthenticator } = require('ibm-watson/auth');
const { SpeechRecorder } = require("speech-recorder");
require("ejs");
require("tough-cookie");

let app = express();
let recorder = new SpeechRecorder();

app.listen(3000);
app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

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
const speechToText = new speechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: 'cProsSxWgkFSWTWkH2bTDU_YmSa1linjUEL5-5lB6mPn',
    }),
    serviceUrl: 'https://api.eu-gb.speech-to-text.watson.cloud.ibm.com/instances/aab5652c-8a5c-4e84-997d-0809f6f3abad'
});

// Pipe in the audio.
recorder.start({
    onAudio: (audio) => {
        speechToText.recognize({audio: audio, contentType: 'audio/x-float-array; rate=16000; channels=1' }).then(speechRecognitionResults => {
            console.log(speechRecognitionResults.result);
        }).catch(error => {
            console.log(error);
        });
    }
})

// Render index when accessing root
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