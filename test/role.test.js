'use strict';
const chai = require('chai');
const expect = chai.expect;
const Role = require('../role');
const nounManager = require('../nounManager');
const sinon = require('sinon');

describe('Role', function () {
  let owner;
  let hasStub;
  let getStub;
  let cat;

  beforeEach('set up new role and stubs', function () {
    owner = new Role('owner');
    hasStub = sinon.stub(nounManager, 'has', noun => noun === 'cat');
    getStub = sinon.stub(nounManager, 'get', noun => cat);
    cat = {
      checkAuthorization: sinon.spy(function (role, verb) {}),
      authorize: sinon.spy(function(role, verbs) {})
    };
  });

  afterEach('restore stubs', function () {
    hasStub.restore();
    getStub.restore();
  });

  describe('constructor', function () {
    it('assigns the name that was passed in', function () {
      expect(owner.name).to.equal('owner');
    });
  });

  describe('can', function () {
    it('returns false if the noun does not exist', function () {
      expect(owner.can('pet', 'dog')).to.be.false;
    });

    it('calls the checkAuthorization method with the correct arguments', function () {
      owner.can('create', 'cat');
      sinon.assert.calledWith(cat.checkAuthorization, 'owner', 'create');
    });
  });

  describe('authorize', function () {
    it('throws an error if the noun does not exist', function () {
      expect(() => { owner.authorize('pet', 'dog'); }).to.throw(Error);
    });

    it('calls the authorize method with the correct arguments', function () {
      owner.authorize(['pet', 'update'], 'cat');
      sinon.assert.calledWith(cat.authorize, 'owner', ['pet', 'update']);
    });
  });

});