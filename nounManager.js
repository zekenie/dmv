'use strict';

/** @todo  extends Map */
class NounManager {
  constructor() {
    this.map = new Map();
    this.set = this.map.set.bind(this.map);
    this.get = this.map.get.bind(this.map);
    this.has = this.map.has.bind(this.map);
    this.values = this.map.values.bind(this.map);
  }
}

module.exports = NounManager;