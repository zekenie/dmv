'use strict';

const afterSetup = module.exports = function(klass) {
  klass.prototype._afterSetupFns = [];

  /**
   * pushes fn to list of functions to run after setup
   * @protected
   * @param  {Function} fn will be passed insnatce
   */
  klass.prototype._afterSetup = function(fn) {
    this._afterSetupFns.push(fn);
  };

  /**
   * Calls all aftersetup methods
   */
  klass.prototype.setup = function() {
    this._afterSetupFns.forEach( (fn) => fn.call(this, this), this);
  };
};