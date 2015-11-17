'use strict';
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/example-db');
const dmv = require('../');

// Defining the nouns
dmv.noun('cat', function(kitten) {
  kitten.can('pet');
  kitten.authorize('owner', ['pet']);
  kitten.authorize('god', '*'); // will have create, read, update, delete, pet
});

// defining the roles
dmv.role('owner');
dmv.role('god');


// mongoose model

const userSchema = new mongoose.Schema({
  name: String
});

userSchema.plugin(dmv.mongoosePlugin);

mongoose.model('User', userSchema);

// seeding
const userPromise = Promise.all([
  mongoose.model('User').create({
    name: 'Zeke',
    roles: ['owner']
  }),
  mongoose.model('User').create({
    name: 'God',
    roles: ['god']
  })
]);

userPromise.then(function(users) {
  let zeke = users[0];
  let god = users[1];
  console.log('can zeke create cats?', zeke.can('create','cat'));
  console.log('can zeke pet cats?', zeke.can('pet', 'cat'));
  console.log('can god update cats?', god.can('update', 'cat'));
});





