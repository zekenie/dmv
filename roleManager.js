'use strict';
/**
 * @module  RoleManager
 * @extends {Map}
 */

class RoleManager extends Map {
  can(roles, verb, noun) {
    return roles.every(r => this.has(r)) && 
    roles.some(r => this.get(r).can(verb, noun));
  }
}

module.exports = RoleManager;