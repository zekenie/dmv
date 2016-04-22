'use strict';
const chai = require('chai');
const spies = require('chai-spies');
const sinon = require('sinon');
chai.use(spies);
const expect = chai.expect;
const Role = require('../role');
const nounManager = require('../nounManager');

describe('Role', function () {
  let owner;
  let hasStub;

  beforeEach('setup', function () {
    owner = new Role('owner');
    hasStub = sinon.stub(nounManager, 'has', function (noun) {
      return noun === 'cat';
    });
  });

  afterEach('restore stubs', function() {
    hasStub.restore();
  });

  describe('constructor', function () {
    it('assigns the name that was passed in', function () {
      expect(owner.name).to.equal('owner');
    });
  });

  describe('can', function () {
    it('returns false if a noun does not exist', function () {
      expect(owner.can('pet', 'dog')).to.be.false;
    });
  });

});