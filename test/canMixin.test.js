'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const canMixin = require('../canMixin');
const dmv = require('../dmv')

describe('canMixin', () => {
  before(() => {
    dmv.role('human');
    dmv.role('god');
    dmv.noun('Cat', (c) => {
      c.verb('pet');
      c.authorize('human', ['pet']);
      c.authorize('god', '*');
    });
  });

  describe('can', () => {
    it('is true for something on the whitelist', () => {
      const user = {
        permissionWhiteList: [{
          noun: 'Cat',
          verb: 'create'
        }],
        permissionBlackList: []
      };
      expect(canMixin.can.call(user, 'create', 'Cat')).to.be.true;
    });

    it('returns false for something on the blacklist', () => {
      const user = {
        permissionWhiteList: [],
        permissionBlackList: [{
          noun: 'Cat',
          verb: 'pet'
        }]
      };
      expect(canMixin.can.call(user, 'pet', 'Cat')).to.be.false;
    });
  });

  describe('hasRole', () => {
    let user;
    beforeEach(() => {
      user = {
        roles: ['a','b']
      }
    });

    it('returns true for a single positive role', () => {
      expect(canMixin.hasRole.call(user,'a')).to.be.true;
    });

    it('returns false for a single negative role', () => {
      expect(canMixin.hasRole.call(user,'c')).to.be.false;
    });

    it('returns true for two positive cases', () => {
      expect(canMixin.hasRole.call(user,['a','b'])).to.be.true;
    });

    it('returns false for one positive case and one negative', () => {
      expect(canMixin.hasRole.call(user,['a','c'])).to.be.false;
    });
  });
});


