var express = require('express');
var app = express();

var AWS = require('aws-sdk');
var fs = require('fs');

var Mail = require('./services/mailer');

var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var download = require('./models/downloads');
var uuid = require('uuid');
var nunjucks = require( 'nunjucks' ) ; //Added nunjucks for templating

app.use(express.static('public'));

dotenv.load();   //get configuration file from .env

mongoose.connect(process.env.DB);

app.use(bodyParser.json());

//Configure Nunjucks
var PATH_TO_TEMPLATES = 'views';
nunjucks.configure( PATH_TO_TEMPLATES, {
    autoescape: true,
    express: app
} ) ;

app.set('view engine', 'html');

var s3client = new AWS.S3({
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,    //required
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, //required
   region: 'us-west-1'
});

app.post('/create-download-key', function(req,res){
  //create download instance and send its id to the user via email
  console.log(req.body);
  console.log(req.body.user_email);
  console.log(req.body.password);
  console.log(req.body.which_file);

  if(process.env.DOWNLOADS_API_KEY==process.env.DOWNLOADS_API_KEY){
    var new_download_file = new download({
      uuid: uuid.v4(),
      user_email: req.body.user_email,
      timestamp: new Date(),
      which_file: req.body.which_file,
      which_distributor: "infiniteindustries",
      number_of_downloads: 0,
      number_of_downloads_limited: false,
      open_to_subscribers: false,
      is_encrypted: false,
      is_production_data: false,
      is_active: true
    })

    new_download_file.save(function(err){
      if(err) throw err;

      res.json({"status":"success","uuid":new_download_file.uuid});
      //here send email, passing uuid to send in email as part of link, passing file name for email subject, although we could pass this back to server since it is currently hard coded
      Mail.sendDownloadEmail(req.body.user_email, new_download_file.uuid, new_download_file.which_file);
      console.log(new_download_file.uuid);
    })
  }
  else{
    res.json({"status":"failure"});
  }

})

app.get('/download-view/:id', function(req,res){
  //if id exists, allow show webpage with DOWNLOAD ME button

  download.findOne({'uuid': req.params.id}, function (err, file_data) {
    if(err) throw err;
    //console.log(file_data);
    if(file_data){
      //res.json({"status":"success","user_email":file_data.user_email}); //temporarily commented out this line, as page does not seem to render .html page otherwise
      var data = {
        user_email:file_data.user_email,
        filename: file_data.which_file,
        uuid: file_data.uuid
      };
      res.render('downloadpage.html', {'data':data}) ;
    }
    else {
      res.render('error.html', {'data':data}) ;
    }
  })
})


app.get('/download-file/:id', function(req,res){
  //if id exists, allow for download otherwise, no bueno
  //console.log(req.params.id);

  download.findOne({'uuid': req.params.id}, function (err, file_data) {
    if(err) throw err;
    //console.log(file_data);
    if(file_data){
      //res.json({"status":"success","stuff":"got a live one! Richie can add download."});
      // var fileKey = 'jr_southard_for_print.tif'
      var fileKey = file_data.which_file+".zip";
      var options = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileKey,
      };

      res.attachment(fileKey);
      var fileStream = s3client.getObject(options).createReadStream();
      fileStream.pipe(res);
    }
    else {
      res.json({"status":"failure"});
    }
  })

})

app.get('/demo',function(req,res){
  res.render('demo',{domain: process.env.DOMAIN});

  //Mail.sendDownloadEmail('richie@ralphvr.com','abracadabra');
})

app.use(function(req,res){
  res.render('404',{domain: process.env.DOMAIN});
});


var appPort=7777;

app.listen(appPort, function () {
  console.log("Magic on port %d", appPort);
});
