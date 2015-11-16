// i need to take a user and ask what that user can do with this noun
// that means i need to be able to pass the noun a role
// and ask what permissions that role can do


class Noun {
  /**
   * @param  {string} name - name of noun
   * @return {noun}        - the created noun
   */
  constructor(name) {
    this.name = name;
    this._afterSetupFns = [];
    this.verbs = new Set();
    this.permissions = {};
    ['create','read','updaate','delete'].forEach( (v) => this.can(v), this);
  }

  /**
   * Private. pushes fn to list of functions to run after setup
   * @param  {Function} fn will be passed insnatce
   */
  _afterSetup(fn) {
    this._afterSetupFns.push(fn);
  }

  /**
   * Calls all aftersetup methods
   */
  setup() {
    this._afterSetupFns.forEach( (fn) => fn.call(this, this), this);
  }

  /**
   * Adds verb to the set of posible verbs that can be authorized. For example, `post.can('like')` would add the verb 'like' to a noun 'post'
   * @param  {[type]} verb [description]
   * @return {[type]}      [description]
   */
  can(verb) {
    this.permissions.add(verb);
  }

  cannot(verb) {
    this.permissions.delete(verb);
  }

  authorize(role, verbs) {
    if(verbs === '*') {
      verbs = this.verbs;
    } else {
      verbs = verbs.filter( (v) => this.verbs.has(v), this);
    }
    this.permissions[role] = this.permissions[role] || new Set();
    verbs.forEach( (v) => this.permissions[role].add(v) );
  }

}


module.exports = Noun;