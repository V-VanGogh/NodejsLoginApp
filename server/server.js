//library imports
const express = require('express');
const bodyparser = require('body-parser');
const _ = require("underscore");


//local imports
var {mongoose} = require('./db/mongoose');
var {User}= require('./models/user');


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
app.get('/users/me', (req,res) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if(!user){
      return Promise.reject();
    }
    res.send(user);
  }).catch((e) => {
    res.status(401).send();
  });
});



//
// app.post('/todos', (req,res) => {
//   var todo = new Todo({
//     text: req.body.text
//   });
//
//   todo.save().then((doc) => {
//     res.send(doc);
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });
//
// app.get('/todos', (req,res) => {
//   Todo.find().then((todos) => {
//     res.send({todos});
//   }, (e) => {
//     res.status(400).send(e);
//   });
// })

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
