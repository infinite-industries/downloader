"use strict";

const dotenv = require("dotenv");
dotenv.load();   // get cofiguration file from .env

const mailgun = require("mailgun.js");
const mg = mailgun.client({
  username: "api",
  key: process.env.LIVE_MAILGUN_API_KEY
});
const mailDomain = process.env.LIVE_MAILGUN_DOMAIN;

const fs = require("fs");

// not used for now but will be later
// var email_templates = {
//
//
//   admin_update:{
//     from: 'INFINITE.INDUSTRIES <info@infinite.industries>',
//     to: ['shifting.planes@gmail.com'],
//     subject: 'update',
//     text: 'Update here'
//   }
// }

// const template = {
//   DOWNLOAD_ID_EMAIL: "aaaarge!"
// };

function loadHTMLTemplate(path_to_template, callback) {
  fs.readFile(path_to_template, "utf8", function(error, data) {
    if(!error) {
      callback(data);
    }
  });
}


module.exports = {

  sendEmail: function(requestedAction) {
    let mailContent = {};
    mailContent.from = "INFINITE.INDUSTRIES <info@infinite.industries>";
    mailContent.to = [requestedAction.email];
    mailContent.subject = process.env.MODE +": "+requestedAction.subject;
    mailContent.text = requestedAction.text;
    mailContent.html = requestedAction.html;

    // console.log(mailContent);
    mg.messages.create(mailDomain, mailContent)
      .then((msg) => console.log(msg))
      .catch((err) => console.log(err));
  },
  sendAdminEmail: function(requestedAction) {
    // var mailContent = email_templates[which_email];
    let mailContent = {};
    mailContent.from = "INFINITE.INDUSTRIES <info@infinite.industries>";
    mailContent.to = [process.env.ADMIN_EMAIL];
    mailContent.subject = process.env.MODE +": "+requestedAction.subject;
    mailContent.text = requestedAction.text;

    // console.log(mailContent);
    mg.messages.create(mailDomain, mailContent)
      .then((msg) => console.log(msg))
      .catch((err) => console.log(err));
  },

  sendDownloadEmail: function(collector_email, user_uuid, download_name) {
    // var download_link = "http://"+process.env.DOMAIN+"/downloads/file/"+user_uuid;
    let download_link = "http://"+process.env.DOMAIN+"/download-view/"+user_uuid;
    let self = this;

    loadHTMLTemplate(__dirname+"/mail_templates/send_download_id.html", function(data) {
      let download_mailer = {
        "subject": "File Download Link",
        "html": data.replace("|*DOWNLOAD_LINK*|", download_link),
        "text": "Thank you for your order and your support! Follow "+download_link+" in order to download your file",
        "email": collector_email
      };

      self.sendEmail(download_mailer);
    });
  }

};
