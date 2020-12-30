const nodemailer = require('nodemailer');
const nmailhbs = require('nodemailer-express-handlebars');
const htmlToText = require('nodemailer-html-to-text').htmlToText;

module.exports = async function (db, content) {

  // Mail Setup - Only Need To Run Once
  // await db.set("mailAddr", "{{ REPLACE THIS }}").catch(console.error);
  // await db.set("mailUser", "{{ REPLACE THIS }}").catch(console.error);
  // await db.set("mailPass", "{{ REPLACE THIS }}").catch(console.error);
  // await db.set("mailHost", "{{ REPLACE THIS }}").catch(console.error);
  // await db.set("mailPort", "{{ REPLACE THIS }}").catch(console.error);

  // Get database object
  let dbobj = await db.getAll().catch(console.error);

  // create reusable transporter object using the default SMTP transport
  transporter = nodemailer.createTransport({
    host: dbobj.mailHost,
    port: dbobj.mailPort,
    secure: false, // true for 465, false for other ports
    auth: {
      user: dbobj.mailUser,
      pass: dbobj.mailPass
    }
  });
  transporter.use('compile', nmailhbs({ 
    viewEngine : {
      extname: '.handlebars', // handlebars extension
      layoutsDir: __dirname + '/themes/default/emails', // location of handlebars templates
      defaultLayout: undefined, // name of main template
      partialsDir: __dirname + '/themes/default/emails', // location of your subtemplates aka. header, footer etc
    }, 
    viewPath: __dirname + '/themes/default/emails', 
    extName: '.handlebars' 
  }));
  //transporter.use('compile', htmlToText());

  var mail = {
     from: dbobj.mailAddr,
     to: content.mail,
     subject: content.subject,
     template: content.template,
     context: content
  }
  transporter.sendMail(mail, (error, data) => {
    if (error) {
      console.log(error);
    }
    else {
      console.log('Mailer Reports No Errors');
    }
  });
};