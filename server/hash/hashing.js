const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err,salt) => {
  bcrypt.hash(user.password,salt,(err,hash) => {
    user.password = hash;
    next();
  });
});
