"use strict";

const express = require("express");
const app = express();

const AWS = require("aws-sdk");
// const fs = require("fs");
const mongoose = require("mongoose");

const Mail = require("./services/mailer");
const Download = require("./models/downloads");

const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const uuid = require("uuid");
const nunjucks = require("nunjucks"); // nunjucks for templating

app.use(express.static("public"));

dotenv.load();   // get configuration file from .env

mongoose.connect(process.env.DB);

app.use(bodyParser.json());

// Configure Nunjucks
let PATH_TO_TEMPLATES = "views";
nunjucks.configure( PATH_TO_TEMPLATES, {
    autoescape: true,
    express: app
} );

app.set("view engine", "html");

let s3client = new AWS.S3({
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,    // required
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // required
   region: "us-west-1"
});

app.post("/create-download-key", function(req, res) {
  // create download instance and send its id to the user via email
  console.log(req.body);
  console.log(req.body.user_email);
  console.log(req.body.password);
  console.log(req.body.which_file);

  if(process.env.DOWNLOADS_API_KEY==process.env.DOWNLOADS_API_KEY) {
    let newDownloadFile = new Download({
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
    });

    newDownloadFile.save(function(err) {
      if(err) throw err;

      res.json({"status": "success", "uuid": new_download_file.uuid});
      // here send email, passing uuid to send in email as part of link,
      // passing file name for email subject,
      // although we could pass this back to server since it is
      // currently hard coded

      Mail.sendDownloadEmail(
        req.body.user_email,
        new_download_file.uuid,
        new_download_file.which_file
      );

      console.log(new_download_file.uuid);
    });
  } else{
    res.json({"status": "failure"});
  }
});

app.get("/download-view/:id", function(req, res) {
  // if id exists, allow show webpage with DOWNLOAD ME button

  download.findOne({"uuid": req.params.id}, function(err, fileData) {
    if(err) throw err;
    // console.log(fileData);
    if(fileData) {
      // res.json({"status":"success","user_email":fileData.user_email});
      // temporarily commented out this line, as page does not seem to render
      // .html page otherwise
      let data = {
        user_email: fileData.user_email,
        filename: fileData.which_file,
        uuid: fileData.uuid
      };
      res.render("downloadpage.html", {
        "domain": process.env.DOMAIN,
        "data": data
      });
    } else {
      res.render("error.html", {
        "domain": process.env.DOMAIN,
        "data": data
      });
    }
  });
});


app.get("/download-file/:id", function(req, res) {
  // if id exists, allow for download otherwise, no bueno
  // console.log(req.params.id);

  download.findOne({"uuid": req.params.id}, function(err, fileData) {
    if(err) throw err;
    // console.log(fileData);
    if(fileData) {
      // res.json({"status":"success","stuff":"got a live one!"});
      // var fileKey = 'jr_southard_for_print.tif'
      let fileKey = fileData.which_file+".zip";
      let options = {
        Bucket: process.env.AWS_BUCKET,
        Key: fileKey
      };

      res.attachment(fileKey);
      let fileStream = s3client.getObject(options).createReadStream();
      fileStream.pipe(res);
    } else {
      res.json({"status": "failure"});
    }
  });
});

app.get("/demo", function(req, res) {
  res.render("demo", {domain: process.env.DOMAIN});

  // Mail.sendDownloadEmail('richie@ralphvr.com','abracadabra');
});

app.use(function(req, res) {
  res.render("404", {domain: process.env.DOMAIN});
});


let appPort=7777;

app.listen(appPort, function() {
  console.log("Magic on port %d", appPort);
});
