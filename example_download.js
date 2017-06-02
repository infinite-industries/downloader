"use strict";

const AWS = require("aws-sdk");
// var fs = require('fs');

const express = require("express");
const app = express();

const dotenv = require("dotenv");

dotenv.load();   // get configuration file from .env

const s3client = new AWS.S3({
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,    // required
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // required
   region: "us-west-1"
});

app.get("/down", function(req, res) {
  let fileKey = "jr_southard_for_print.tif";

  let options = {
    Bucket: process.env.AWS_BUCKET,
    Key: fileKey
  };

  res.attachment(fileKey);
  let fileStream = s3client.getObject(options).createReadStream();
  fileStream.pipe(res);
});

const appPort=7778;

app.listen(appPort, function() {
  console.log("Magic on port %d", appPort);
});
