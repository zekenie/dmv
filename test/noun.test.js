'use strict';
const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const expect = chai.expect;
const crud = ['create', 'read', 'update', 'delete'];
const Noun = require('../noun');
const dmv = require('../');

describe('Noun', function () {
  let noun;
  beforeEach(function () {
    noun = new Noun('cat');
  });

  describe('setup', function () {
    let spy = chai.spy();
    beforeEach(function () {
      noun._afterSetup(spy);
    });

    beforeEach(function () {
      noun.setup();
    });

    it('calls the after setup functions', function () {
      expect(spy).to.have.been.called();
    });
  });

  describe('verbs', function () {
    it('has default crud verbs', function () {
      crud.forEach((p) => expect(noun.hasVerb(p)).to.be.true);
    });

    it('can add a verb', function () {
      noun.verb('pet');
      expect(noun.hasVerb('pet')).to.be.true;
    });

    it('can remove a verb', function () {
      noun.verb('pet');
      noun.removeVerb('pet');
      expect(noun.hasVerb('pet')).to.be.false;
    });
  });

  describe('authorization', function () {
    beforeEach(function () {
      noun.verb('pet');
    });

    it('does not allow roles to use verbs unless they have been authorized', function () {
      expect(noun.checkAuthorization('owner', 'pet')).to.be.false;
    });

    it('can authorize a role to use a verb', function () {
      noun.authorize('owner', ['pet']);
      expect(noun.checkAuthorization('owner', 'pet')).to.be.true;
    });

    it('can authorize a role to use all verbs using the * option', function () {
      noun.authorize('god', '*');
      crud.forEach((p) => expect(noun.checkAuthorization('god', p)).to.be.true);
      expect(noun.checkAuthorization('god', 'pet')).to.be.true;
    });

  });
});
