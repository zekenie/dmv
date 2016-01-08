'use strict';
/**
 * @class  Noun
 */

class Noun extends require('./afterSetup'){
  /**
   * @param  {string} name - name of noun
   * @return {noun}        - the created noun
   */
  constructor(name) {
    super();
    this.name = name;
    this.verbs = new Set();
    this.permissions = {};
    ['create','read','update','delete'].forEach( (v) => this.verb(v), this);
  }

  /**
   * Checks to see if noun has verb
   * @param  {string}  verb
   * @return {Boolean}
   */
  hasVerb(verb) {
    return this.verbs.has(verb);
  }

  /**
   * Adds verb to the set of posible verbs that can be authorized. For example, `post.can('like')` would add the verb 'like' to a noun 'post'
   * @param  {string} verb
   */
  verb(verb) {
    this.verbs.add(verb);
  }

  /**
   * Removes a verb from the set of possible verbs. Useful for removing default crud.
   * @param  {string} verb
   */
  removeVerb(verb) {
    this.verbs.delete(verb);
  }

  /**
   * Authorizes a role to perform a verb.
   * @param  {string} role
   * @param  {string[]|string} verbs - Either the string '*', which authorizes all possible verbs to the given role, or an array of verbs to authorize.
   */
  authorize(role, verbs) {
    if(verbs === '*') {
      verbs = this.verbs;
    } else {
      verbs = verbs.filter( (v) => this.verbs.has(v), this);
    }
    this.permissions[role] = this.permissions[role] || new Set();
    verbs.forEach( (v) => this.permissions[role].add(v) );
  }

  /**
   * Checks if a role is regestered and it has the permission
   * @param  {string} role
   * @param  {string} verb
   * @return {boolean}
   */
  checkAuthorization(role, verb) {
    return !!this.permissions[role] && this.permissions[role].has(verb);
  }

}

module.exports = Noun;