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

async function mailer() {

  // Get database object
  var dbobj = await db.getAll();
  await db.delete("emailPass");
  console.log(dbobj);
  console.log('User:', dbobj.mailUser, '\nPass:', dbobj.mailPass);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ionos.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: dbobj.mailUser,
      pass: dbobj.mailPass,
    },
  });

  // send mail with defined transport object
  let content = await transporter.sendMail({
    from: '"Anthonian Uptime Monitoring" <uptime@anth.dev>', // sender address
    to: "hi@anth.dev", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", content.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(content));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

mailer().catch(console.error);

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
