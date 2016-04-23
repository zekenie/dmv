'use strict';
const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const expect = chai.expect;
let nounManager = require('../nounManager');

describe('nounManager', function () {

  describe('set', function () {
    it('returns the set property', function () {
      expect(nounManager.set('cat', {fluffy: true})).to.have.property('fluffy', true);
    });
  });

  describe('get', function () {
    it('retrieves a set property value', function () {
      nounManager.set('cat', {fluffy: true});
      expect(nounManager.get('cat')).to.have.property('fluffy', true);
    });
  });

  describe('has', function () {
    it('returns true if a noun has been set', function () {
      nounManager.set('cat', {fluffy: true});
      expect(nounManager.has('cat')).to.be.true;
    });

    it('returns false if a noun has not been set', function () {
      expect(nounManager.has('dog')).to.be.false;
    });
  });

  describe('getAll', function () {
    it('returns all nouns that have been set', function () {
      nounManager.set('cat', {fluffy: true});
      nounManager.set('dog', {friendly: true});
      expect(nounManager.getAll()[0]).to.have.property('fluffy', true);
      expect(nounManager.getAll()[1]).to.have.property('friendly', true);
    });
  });

});