const {ObjectID} = require('mongodb');
const jwt =require('jsonwebtoken');

const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();


const users = [{
  _id: userOneId,
  email: 'nikos@example.com',
  password: 'passuser1',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'nikos2@example.com',
  password: 'passuser2',
}]

const populateUsers = (done) => {
  User.remove({}).then(() =>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne,userTwo]);
  }).then(() => done());
};

module.exports = {users, populateUsers};
