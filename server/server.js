require('./config/config');

//library imports
const express = require('express');
const bodyparser = require('body-parser');
const _ = require("underscore");
const {ObjectID} = require('mongodb');

var router = express.Router();



//local imports
var {mongoose} = require('./db/mongoose');
var {User}= require('./models/user');
var {authenticate} = require('./middleware/authenticate');
var app = express();
// var api = require('api');

// app.use(express.static(__dirname + './../node_modules'));
// prepare server
// app.use('/api', api); // redirect API calls
app.use('/js', express.static(__dirname + './../node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/Js', express.static(__dirname + './../node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + './../node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/myCss',express.static(__dirname + '/public'));//redirect for my css



var path = __dirname + '/views';
router.get('/', (req,res) => {
  res.sendFile(path + '/index.html');
});

app.use('/',router);


const port = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());


// POST /users
app.post('/users', (req,res) => {
  if(req.body.password == req.body.passwordConfirm) {
  var arr = ['email', 'password'];
  var body = _.pick(req.body, arr);
  console.log(arr,body);
  var user = new User(body);

  user.save().then((user) => {
    return user.generateAuthToken();
    // res.send(user);
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }, (e) => {
    res.status(400).send(e);
  });
}
else if(req.body.password != req.body.passwordConfirm) {
  res.redirect('/?e=' + encodeURIComponent('Passwords must be the same'));
}
});



//Make a private route
// Get /users/me

app.get('/users/me',authenticate, (req,res) => {
  res.send(req.user);
});

router.get('/about', (req,res) => {
  res.sendFile(path + '/about.html');
});



app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
