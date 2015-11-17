'use strict';

const nouns = {};
const _ = require('lodash');

module.exports = {
  get: function(name) {
    return nouns[name];
  },

  getAll: function() {
    return _.values(nouns);
  },

  has: function(name) {
    return !!this.get(name);
  },

  set: function(name, value) {
    nouns[name] = value;
    return value;
  }
};