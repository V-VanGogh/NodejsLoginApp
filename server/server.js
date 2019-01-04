require('./config/config');

//library imports
const express = require('express');
const bodyparser = require('body-parser');
const _ = require("underscore");
const {ObjectID} = require('mongodb');



//local imports
var {mongoose} = require('./db/mongoose');
var {User}= require('./models/user');
var {authenticate} = require('./middleware/authenticate');


var app = express();
const port = process.env.PORT || 3000;

app.use(bodyparser.json());


// POST /users
app.post('/users', (req,res) => {
  var body = _.pick(req.body, ['email','password']);
  var user = new User(body);


  user.save().then((user) => {
    return user.generateAuthToken();
    // res.send(user);
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }, (e) => {
    res.status(400).send(e);
  });
});

//Make a private route
// Get /users/me

app.get('/users/me',authenticate, (req,res) => {
  res.send(req.user);
});




app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
