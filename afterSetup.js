'use strict';

module.exports = class AfterSetup {
  constructor() {
    this._afterSetupFns = [];
  }

  _afterSetup(fn) {
    if(this.setupRan) {
      fn.call(this, this);
    }
    this._afterSetupFns.push(fn);
  }

  setup() {
    this._afterSetupFns.forEach( (fn) => fn.call(this, this), this);
    this.setupRan = true;
  }
}