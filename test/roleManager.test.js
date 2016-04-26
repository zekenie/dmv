'use strict';
const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const expect = chai.expect;
let roleManager = require('../roleManager');

describe('roleManager', function () {
  let owner;
  let god;

  beforeEach('define roles', function () {
    owner = { 
      can: (verb, noun) => verb === 'pet' && noun === 'cat',
      cheerful: true 
    };
    god = { 
      can: (verb, noun) => noun === 'cat',
      immortal: true 
    };
  });

  describe('set', function () {
    it('registers a role', function () {
      expect(roleManager.set('owner', owner)).to.have.property('cheerful', true);
    });
  });

  describe('get', function () {
    it('retrieves a role', function () {
      roleManager.set('owner', owner);
      expect(roleManager.get('owner')).to.have.property('cheerful', true);
    });
  });

  describe('has', function () {
    it('returns true if a role has been set', function () {
      roleManager.set('owner', owner);
      expect(roleManager.has('owner')).to.be.true;
    });

    it('returns false if a role has not been set', function () {
      expect(roleManager.has('god')).to.be.false;
    });
  });

  describe('getAll', function () {
    it('returns all roles that have been set', function () {
      roleManager.set('owner', owner);
      roleManager.set('god', god);
      expect(roleManager.getAll()[0]).to.have.property('cheerful', true);
      expect(roleManager.getAll()[1]).to.have.property('immortal', true);
    });
  });

  describe('can', function () {

    beforeEach('set roles', function () {
      roleManager.set('owner', owner);
      roleManager.set('god', god);
    });

    it('returns false if any roles in the arguments have not been set', function () {
      expect(roleManager.can(['owner', 'god', 'catsitter'], 'pet', 'cat')).to.be.false;
    });

    it('returns true if at least one role has the required permissions', function () {
      expect(roleManager.can(['owner', 'god'], 'create', 'cat')).to.be.true;
    });

    it('returns false if no roles have the required permissions', function () {
      expect(roleManager.can(['owner', 'god'], 'pet', 'dog')).to.be.false;
    });
  });

});