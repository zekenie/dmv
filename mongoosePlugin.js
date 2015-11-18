'use strict';

/**
 * @description  This is a [mongoose plugin](http://mongoosejs.com/docs/plugins.html).
 *   It exports a function which modifies a mongoose schema.
 *   It adds 3 paths:
 *     - roles
 *     - permissionsWhitelist
 *     - PermissionsBlacklist
 *
 *   It is meant to be used on a sort of user model.
 * @module plugins/mongoose
 * @requires  roleManager
 * @requires lodash
 */

const roleManager = require('./roleManager');
const _ = require('lodash');

/**
 * Checks if a user has the ability to perform an action on a noun
 * @memberOf plugins/mongoose
 * @param  {string} verb
 * @param  {string} noun
 * @return {boolean}
 */
const can = function(verb, noun) {
  if(_.where(this.permissionsWhitelist, { verb, noun }).length) {
    return true;
  } else if(_.where(this.permissionsBlacklist, { verb, noun }).length) {
    return false;
  } else {
    return roleManager.can(this.roles, verb, noun);
  }
}

/**
 * @classDesc Mongoose plugin to provide roles to users
 * @mixin
 */
const mongoosePlugin = module.exports = function(schema) {
  /**
   * @lends  plugins/mongoose
   */

  const permissionsArray = [{
    noun: String,
    verb: String
  }];

  schema.add({
    roles: [String],
    permissionsWhitelist: permissionsArray,
    permissionsBlacklist: permissionsArray
  });

  schema.methods.can = can;
};
