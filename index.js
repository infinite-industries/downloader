var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var dotenv = require('dotenv');

dotenv.load();   //get configuration file from .env

console.log(process.env.DOWNLOADS_API_KEY);

app.use(bodyParser.json());

app.post('/api', function(req,res){
  console.log(req.body);
  console.log(req.body.user_email);
})

app.get('/dog',function(req,res){
  res.send("I aint no cat");
})

app.use(function(req,res){
  //res.render('404',{domain: process.env.DOMAIN});
  res.send("yo!");
});


var appPort=7777;

app.listen(appPort, function () {
  console.log("Magic on port %d",appPort);
});
