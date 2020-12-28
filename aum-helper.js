const mailer = require('./mailer');
const repldb = require('./repldb');
const randchar = require('./randchar');
const fs = require('fs');
const stringify = require('json-stringify-safe');

module.exports.welcomeMail = async function (db, req) {
  let key = randchar(8);
  db.set(key, req.body.url).catch(console.error);
  content = {
    template: 'welcome',
    subject: 'Welcome To Anthonian Uptime Monitoring',
    mail: req.body.email,
    key: key,
    url: req.body.url
  }
  mailer(db, content).catch(console.error);
}

module.exports.log = async function (access, req) {
  var logs = stringify(req);
  fs.appendFile('access-logs.json', "\n" + logs, function(err) {
    if (err) throw err;
  });
  var currentLog = Date().toString() + ' Access to ' + access + ' logged';
  fs.appendFile('brief-logs.log', "\n" + currentLog, function(err) {
    if (err) throw err;
  });
  console.log(currentLog);
}