const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const stringify = require('json-stringify-safe');
const exphbs  = require('express-handlebars');
const mailer = require('./mailer');
const repldb = require('./repldb');
const aum = require('./aum-helper');
const Database = require("@replit/database");
const db = new Database();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({
    extname: '.handlebars', // handlebars extension
    layoutsDir: __dirname + '/themes/default/templates', // location of handlebars templates
    defaultLayout: 'default', // name of main template
    partialsDir: __dirname + '/themes/default/templates', // location of your subtemplates aka. header, footer etc
  }
));
app.set('view engine', 'handlebars');

async function serverStart() {
  var content = {mail: await aum.adminMail(db).catch(console.error), subject: '[AUM] Server Started Mode: ' + process.env.NODE_ENV, template: 'default', message: Date().toString()};
  var transport = mailer(db, content).catch(console.error);
};
serverStart();

var monitor = setInterval(function () {
  console.log(Date().toString() + ' Monitoring');
  aum.monitor(db).catch(console.error);
}, 60000);

app.use(express.static('public'));

app.get('/', (req, res) => {
  aum.log('index', req);
  res.sendFile(__dirname + '/private/index.html');
});

app.get('/terminate', (req, res) => {
  aum.log('terminate', req);
  res.sendFile(__dirname + '/private/terminate.html');
});

app.post('/processor', (req, res) => {
  aum.log('processor', req);
  aum.welcomeMail(db, req);
  res.sendFile(__dirname + '/private/success.html');
});

app.post('/terminate', (req, res) => {
  aum.log('terminated', req);
  aum.byeMail(db, req);
  res.sendFile(__dirname + '/private/terminated.html');
});

app.use(express.static(__dirname + '/public'));

app.listen(3000, () => {
  console.log(Date().toString() + ' Server started! Mode: ' + process.env.NODE_ENV);
});
