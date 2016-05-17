'use strict';
/**
 * @module  RoleManager
 */


/** @todo  extends Map */
class RoleManager {

  constructor() {
    this.map = new Map();
    this.set = this.map.set.bind(this.map);
    this.get = this.map.get.bind(this.map);
    this.has = this.map.has.bind(this.map);
    this.values = this.map.values.bind(this.map);
  }
  can(roles, verb, noun) {
    return roles.every(r => this.has(r)) && 
    roles.some(r => this.get(r).can(verb, noun));
  }
}

module.exports = RoleManager;