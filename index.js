const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const stringify = require('json-stringify-safe');
const nodemailer = require('nodemailer');
const Database = require("@replit/database");
const db = new Database();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  var logs = stringify(req);
  fs.appendFile('access-logs.json', "\n" + logs, function(err) {
    if (err) throw err;
  });
  var currentLog = Date().toString() + ' Access to index logged';
  fs.appendFile('brief-logs.log', "\n" + currentLog, function(err) {
    if (err) throw err;
  });
  console.log(currentLog);
  res.sendFile(__dirname + '/private/index.html');
});

var transporter;

var dbobj = db.getAll().then((obj) => {
    transporter = nodemailer.createTransport({
    service: 'smtp.ionos.com',
    port: 587,
    secure: true,
    auth: {
      user: dbobj.emailUser,
      pass: dbobj.emailPass
    }
  });
});

app.post('/processor', (req, res) => {
  var logs = stringify(req);
  fs.appendFile('access-logs.json', "\n" + logs, function(err) {
    if (err) throw err;
  });
  var currentLog = Date().toString() + ' Access to processor logged';
  fs.appendFile('brief-logs.log', "\n" + currentLog, function(err) {
    if (err) throw err;
  });
  console.log(currentLog);
  res.sendFile(__dirname + '/private/success.html');
});

var logTimer = setInterval(function () {
    console.log(Date().toString() + ' No activity logged');
}, 60000);

app.use(express.static(__dirname + '/public'));

app.listen(3000, () => console.log(Date().toString() + ' Server started!'));
