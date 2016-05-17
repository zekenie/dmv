'use strict';

const roles = require('./roles');

const onPermissionList = (list, verb, noun) => {
  return list && !!list.find(item => item.verb === verb && item.noun === noun);
};

/**
 * Checks if a user has the ability to perform an action on a noun
 * @memberOf plugins/mongoose
 * @param  {string} verb
 * @param  {string} noun
 * @return {boolean}
 */
exports.can = function(verb, noun) {
  if(onPermissionList(this.permissionWhiteList, verb, noun)) {
    return true;
  } else if(onPermissionList(this.permissionBlackList, verb, noun)) {
    return false;
  } else {
    return roles.can(this.roles, verb, noun);
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
    return !r.some(role => this.roles.indexOf(role) === -1)
  }
};