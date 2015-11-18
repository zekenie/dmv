'use strict';
/**
 * @class Role
 */
const nounManager = require('./nounManager');

class Role {
  constructor(name) {
    this.name = name;
  }

  /**
   * Checks if a given noun can perform a given verb
   * @param  {string} verb
   * @param  {string} noun
   * @return {boolean}
   */
  can(verb, noun) {
    if(!nounManager.has(noun)) { return false; }
    return nounManager.get(noun).checkAuthorization(this.name, verb);
  }
}

require('./setupMixin')(Role);

module.exports = Role;