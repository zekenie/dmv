'use strict';

const _ = require('lodash');
const roleManager = require('./roleManager');

/**
 * Checks if a user has the ability to perform an action on a noun
 * @memberOf plugins/mongoose
 * @param  {string} verb
 * @param  {string} noun
 * @return {boolean}
 */
exports.can = function(verb, noun) {
  if(_.filter(this.permissionsWhitelist, { verb, noun }).length) {
    return true;
  } else if(_.filter(this.permissionsBlacklist, { verb, noun }).length) {
    return false;
  } else {
    return roleManager.can(this.roles, verb, noun);
  }
};

/**
 * Determines if user has role or roles
 * @param  {String|Array}  r role
 * @return {Boolean}
 */
exports.hasRole = function(r) {
  if (typeof r === 'string'){
    return this.roles.indexOf(r) !== -1;
  } else if (Array.isArray(r)) {
    let hasAllRoles = true;
    r.forEach(function (role) {
      if (this.roles.indexOf(role) === -1){
        hasAllRoles = false;
      }
    }, this);
    return hasAllRoles;
  }
};