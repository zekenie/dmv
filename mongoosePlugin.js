'use strict';

const permissionSchema = require('./permissionSchema');

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
const hasRole = function(r) {
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

/**
 * @classDesc Mongoose plugin to provide roles to users
 * @mixin
 */
const mongoosePlugin = module.exports = function(schema) {
  /**
   * @lends  plugins/mongoose
   */

  schema.add({
    roles: [String],
    permissionsWhitelist: [permissionSchema],
    permissionsBlacklist: [permissionSchema]
  });

  schema.methods.can = can;
  schema.methods.hasRole = hasRole;
};
