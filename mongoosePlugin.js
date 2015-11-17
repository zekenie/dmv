'use strict';

const roleManager = require('./roleManager');
const _ = require('lodash');

module.exports = function(schema) {

  const permissionsArray = [{
    noun: String,
    verb: String
  }];

  schema.add({
    roles: [String],
    permissionsWhitelist: permissionsArray,
    permissionsBlacklist: permissionsArray
  });



  schema.methods.can = function(verb, noun) {
    if(_.where(this.permissionsWhitelist, { verb, noun }).length) {
      return true;
    } else if(_.where(this.permissionsBlacklist, { verb, noun }).length) {
      return false;
    } else {
      return roleManager.can(this.roles, verb, noun);
    }

  };
};