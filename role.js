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
   * @function
   * @example
   * someRole.can('eat','brick'); // -> true
   * @param  {string} verb
   * @param  {string} noun
   * @return {boolean}
   */
  can(verb, noun) {
    if(!nounManager.has(noun)) { return false; }
    return nounManager.get(noun).checkAuthorization(this.name, verb);
  }

  /**
   * Authorizes this role to perform an array of actions on a verb
   * @function
   * @see  Noun#authorize
   * @example  someRole.authorize(['create','read'], 'kitten');
   * @param  {String[]|String} verbs - Either an array of verbs already regestered with the noun, or `'*'` to allow access to all verbs
   * @param  {String} noun
   */
  authorize(verbs, noun) {
    if(!nounManager.has(noun)) { throw new Error(`cannot authorize ${noun}`); }
    nounManager.get(noun).authorize(this.name, verbs);
  }
}

require('./setupMixin')(Role);

module.exports = Role;