'use strict';
const chai = require('chai');
const spies = require('chai-spies');
chai.use(spies);
const expect = chai.expect;
const crud = ['create', 'read', 'update', 'delete'];
const Noun = require('../noun');

describe('Noun', function() {
  let noun;
  beforeEach(function() {
    noun = new Noun('cat');
  });


  describe('setup', function() {
    let spy = chai.spy();
    beforeEach(function() {
      noun._afterSetup(spy);
    });

    beforeEach(function() {
      noun.setup();
    });

    it('calls the after setup functions', function() {
      expect(spy).to.have.been.called();
    });
  });

  describe('verbs', function() {
    it('has default crud verbs', function() {
      crud.forEach( (p) => expect(noun.hasVerb(p)).to.be.true );
    });


  });
});