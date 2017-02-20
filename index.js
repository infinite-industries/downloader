var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var dotenv = require('dotenv');

var mongoose = require('mongoose');
var download = require('./models/downloads');
var uuid = require('uuid');

dotenv.load();   //get configuration file from .env

mongoose.connect(process.env.DB);

app.use(bodyParser.json());

app.post('/create-download-key', function(req,res){
  //create download instance and send its id to the user via email
  console.log(req.body);
  console.log(req.body.user_email);
  console.log(req.body.password);
  console.log(req.body.which_file);

  if(req.body.password==process.env.DOWNLOADS_API_KEY){
    var new_download_file = new download({
      uuid: uuid.v4(),
      user_email: req.body.user_email,
      timestamp: new Date(),
      number_of_downloads: 0,
      which_file: req.body.which_file,
      is_production_data: false,
      is_active: true
    })

    new_download_file.save(function(err){
      if(err) throw err;

      res.json({"status":"success"});
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
      res.json({"status":"success","user_email":file_data.user_email});
    }
    else {
      res.json({"status":"failure"});
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
      res.json({"status":"success","stuff":"got a live one! Richie can add download."});
    }
    else {
      res.json({"status":"failure"});
    }
  })

})

app.use(function(req,res){
  //res.render('404',{domain: process.env.DOMAIN});
  res.send("yo!");
});

var appPort=7777;

app.listen(appPort, function () {
  console.log("Magic on port %d",appPort);
});
