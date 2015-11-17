'use strict';

const nounManager = require('./nounManager');

class Role {
  constructor(name) {
    this.name = name;
    this._afterSetupFns = [];
  }

  /**
   * pushes fn to list of functions to run after setup
   * @protected
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

  can(verb, noun) {
    if(!nounManager.has(noun)) { return false; }
    return nounManager.get(noun).checkAuthorization(this.name, verb);
  }
}

module.exports = Role;