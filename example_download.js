var AWS = require('aws-sdk');
var fs = require('fs');

var express = require('express');
var app = express();

var dotenv = require('dotenv');

dotenv.load();   //get configuration file from .env

var s3client = new AWS.S3({
   accessKeyId: process.env.AWS_ACCESS_KEY_ID,    //required
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, //required
   region: 'us-west-1'
});

app.get('/down', function(req,res){
  var fileKey = 'jr_southard_for_print.tif'

  var options = {
    Bucket: process.env.AWS_BUCKET,
    Key: fileKey,
  };

  res.attachment(fileKey);
  var fileStream = s3client.getObject(options).createReadStream();
  fileStream.pipe(res);
})

var appPort=7778;

app.listen(appPort, function () {
  console.log("Magic on port %d",appPort);
});
