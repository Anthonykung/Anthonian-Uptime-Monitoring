const mailer = require('./mailer');
const repldb = require('./repldb');
const randchar = require('./randchar');
const fs = require('fs');
const stringify = require('json-stringify-safe');
const ping = require('ping');
const urlmodule = require('url');
const http = require('http');

async function jsonURL(url) {
  /*url = url.replace("https://", "");
  url = url.replace("http://", "");
  let i = 0;
  for (i = 0; i < url.length; i++) {
    if (url[i] == '/') {
      url = url.slice(0, i);
    }
  }*/
  url = new URL(url);
  //console.log(url);
  return url;
}

module.exports.adminMail = async function (db) {
  let mail = await db.get("mailAddr").catch(console.error);
  return mail;
}

module.exports.welcomeMail = async function (db, req) {
  let key = 'urls-' + randchar(8);
  let url = await jsonURL(req.body.url);
  //console.log(url);
  data = { mail: req.body.email, url: url, hostname: url.hostname, pathname: url.pathname, status: 0, laps: 0 }
  db.set(key, data).catch(console.error);
  console.log('Key Created:', key);
  content = {
    template: 'welcome',
    subject: 'Welcome To Anthonian Uptime Monitoring',
    mail: data.mail,
    key: key,
    url: data.url
  }
  mailer(db, content).catch(console.error);
}

module.exports.byeMail = async function (db, req) {
  let data = await db.get(req.body.key).catch(console.error);
  //console.log(data);
  content = {
    template: 'bye',
    subject: '[AUM] Uptime Monitoring Terminated',
    mail: data.mail,
    key: req.body.key,
    url: data.url
  }
  db.delete(req.body.key).catch(console.error);
  console.log('Key Deletion:', req.body.key);
  mailer(db, content).catch(console.error);
}

module.exports.log = async function (access, req) {
  // Detailed Request logs
  /*
  var logs = stringify(req);
  fs.appendFile('access-logs.json', "\n" + logs, function(err) {
    if (err) throw err;
  });
  */
  // Brief Access Logs
  var currentLog = Date().toString() + ' Access to ' + access + ' logged';
  /*
  fs.appendFile('brief-logs.log', "\n" + currentLog, function(err) {
    if (err) throw err;
  });
  */
  console.log(currentLog);
}

async function downMailer(db, key, mail, url) {
  content = {
    template: 'down',
    subject: url + ' Is Unresponsive!',
    mail: mail,
    key: key,
    url: url,
    time: Date().toString()
  }
  mailer(db, content).catch(console.error);
}

async function upMailer(db, key, mail, url) {
  content = {
    template: 'up',
    subject: url + ' Is Back Alive!',
    mail: mail,
    key: key,
    url: url,
    time: Date().toString()
  }
  mailer(db, content).catch(console.error);
}

module.exports.monitor = async function monitor(db) {
  db.list("urls").then(objts => {
    for (i in objts) {
      db.get(objts[i]).then(objt => {
        url = new URL(objt.url);
        let  options = {
          host: url.hostname,
          path: url.pathname
        };
        //console.log(objt.url);
        //console.log(options);
        http.get(options, (res) => {
          //console.log(res);
          if (objt.status != 0) {
            upMailer(db, objts[i], objt.mail, objt.url);
            data = objt;
            data.status = 0;
            data.laps = 0;
            db.set(objts[i], data).catch(console.error);
          }
        }).on('error', function(error) {
          //console.log(error);
          if (objt.status == 0) {
            downMailer(db, objts[i], objt.mail, objt.url);
            data = objt;
            data.status = 1;
            db.set(objts[i], data).catch(console.error);
          }
          else if (objt.status == 1) {
            downMailer(db, objts[i], objt.mail, objt.url);
            data = objt;
            data.status = 2;
            data.laps += 1;
            db.set(objts[i], data).catch(console.error);
          }
          else if (objt.status == 2) {
            if (objt.laps != 60) {
              data = objt;
              data.status = 2;
              data.laps += 1;
              db.set(objts[i], data).catch(console.error);
            }
            else {
              downMailer(db, objts[i], objt.mail, objt.url);
              data = objt;
              data.status = 2;
              data.laps = 0;
              db.set(objts[i], data).catch(console.error);
            }
          }
        });
      });
    }
  });
}

module.exports.cleardb = async function(db) {
  db.list("urls").then(objts => {
    for (i in objts) {
      db.delete(objts[i]).catch(console.error);
    }
  });
}