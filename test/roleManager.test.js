'use strict';
const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const expect = chai.expect;
let RoleManager = require('../roleManager');

describe('roleManager', function () {
  let owner;
  let god;
  let roles = new RoleManager();

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

  it('is a Map', () => {
    expect(new RoleManager() instanceof Map).to.be.true;
  });

  describe('can', function () {

    beforeEach('set roles', function () {
      roles.set('owner', owner);
      roles.set('god', god);
    });

    it('returns false if any roles in the arguments have not been set', function () {
      expect(roles.can(['owner', 'god', 'catsitter'], 'pet', 'cat')).to.be.false;
    });

    it('returns true if at least one role has the required permissions', function () {
      expect(roles.can(['owner', 'god'], 'create', 'cat')).to.be.true;
    });

    it('returns false if no roles have the required permissions', function () {
      expect(roles.can(['owner', 'god'], 'pet', 'dog')).to.be.false;
    });
  });
});