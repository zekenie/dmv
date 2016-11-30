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
    this.clear = this.map.clear.bind(this.map);
  }
  can(roles, verb, noun) {
    return roles.map(r => this.get(r) || { can: () => false })
      .some(r => r.can(verb, noun));
  }
}

module.exports = RoleManager;