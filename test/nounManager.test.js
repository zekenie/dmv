'use strict';
const chai = require('chai');
const expect = chai.expect;
let NounManager = require('../nounManager');

describe('NounManager', function () {
  xit('is a Map', () => {
    expect(new NounManager() instanceof Map).to.be.true;
  });
});