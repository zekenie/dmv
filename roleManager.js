'use strict';

const roles = {};
const _ = require('lodash');

/**
 * @module  RoleManager
 */

module.exports = {
  /**
   * Gets a role by name
   * @param  {string} name
   * @return {role}
   */
  get: function(name) {
    return roles[name];
  },

  /**
   * gets all registered roles
   * @return {role[]}
   */
  getAll: function() {
    return _.values(roles);
  },

  has: function(name) {
    return !!this.get(name);
  },

  set: function(name, value) {
    roles[name] = value;
    return value;
  },

  can: function(roles, verb, noun) {
    if(roles.some( (r) => !this.has(r), this)) { return false; }
    return roles
      .map(function(role) {
        return this.get(role);
      }, this)
      .some(function(role) {
        return role.can(verb, noun);
      });
  }
};