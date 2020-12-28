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

var content = {mail: 'hi@anth.dev', subject: '[AUM] Server Started', template: 'default', message: Date().toString()};
var transport = mailer(db, content).catch(console.error);

app.use(express.static('public'));

app.get('/', (req, res) => {
  aum.log('index', req);
  res.sendFile(__dirname + '/private/index.html');
});

app.post('/processor', (req, res) => {
  aum.log('processor', req);
  aum.welcomeMail(db, req);
  res.sendFile(__dirname + '/private/success.html');
});

var logTimer = setInterval(function () {
  
}, 60000);

app.use(express.static(__dirname + '/public'));

app.listen(3000, () => console.log(Date().toString() + ' Server started!'));
