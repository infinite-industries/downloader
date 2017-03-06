var dotenv = require('dotenv');
dotenv.load();   //get cofiguration file from .env

var mailgun = require('mailgun.js');
var mg = mailgun.client({username: 'api', key: process.env.LIVE_MAILGUN_API_KEY});
var mail_domain = process.env.LIVE_MAILGUN_DOMAIN;

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

module.exports = {

  sendEmail: function(requested_action){
    var mail_content = {};
    mail_content.from = 'INFINITE.INDUSTRIES <info@infinite.industries>';
    mail_content.to = [requested_action.email];
    mail_content.subject = process.env.MODE +': '+requested_action.subject;
    mail_content.text = requested_action.text;
    mail_content.html = requested_action.html;

    // console.log(mail_content);
    mg.messages.create(mail_domain, mail_content)
      .then(msg => console.log(msg))
      .catch(err => console.log(err));

  },
  sendAdminEmail:function(requested_action){

    //var mail_content = email_templates[which_email];
    var mail_content = {};
    mail_content.from = 'INFINITE.INDUSTRIES <info@infinite.industries>';
    mail_content.to = [process.env.ADMIN_EMAIL];
    mail_content.subject = process.env.MODE +': '+requested_action.subject;
    mail_content.text = requested_action.text;

    // console.log(mail_content);
    mg.messages.create(mail_domain,mail_content)
      .then(msg => console.log(msg))
      .catch(err => console.log(err));
  },

  sendDownloadEmail: function(collector_email, download_id, has_physical_delivery){
    var download_link = "https://"+process.env.DOMAIN+"/downloads/file/"+download_id;

    // if(process.env.MODE=="DEVELOPMENT"){
    //   download_link = "http://localhost:7777//downloads/file/"+download_id;
    // }


    var download_mailer = {
      'subject':'File Download Link for Order #'+ download_id,
      'html':"<html><p>Thank you for your order and your support! Here is a link to your <a href="+download_link+">download</a> page<p><p>Please let us know if you need any additional help.</p><p>Yours,</p><p>Infinite Industries</p></html>",
      'text':"Thank you for your order and your support! Follow "+download_link+" in order to download your file",
      'email': collector_email
    };

    this.sendEmail(download_mailer);

  }

}
