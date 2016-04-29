'use strict';
/**
 * @module  RoleManager
 * @extends {Map}
 */

class RoleManager extends Map {
  can(roles, verb, noun) {
    if(roles.some(r => !this.has(r))) { return false; }
    return roles
      .map(role => this.get(role))
      .some(role => role.can(verb, noun));
  }
}

module.exports = RoleManager;