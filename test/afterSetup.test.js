'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
let afterSetup = require('../afterSetup');

describe('afterSetup', function () {
  let instance;

  beforeEach('create instance', function () {
    instance = new afterSetup();
  });

  describe('constructor', function () {
    it('creates an instance with an empty array of _afterSetupFns', function () {
      expect(instance).to.have.property('_afterSetupFns')
      .that.is.an('array')
      .to.have.lengthOf(0);
    });
  });

  describe('_afterSetup', function () {
    let spy;

    beforeEach('set up spy', function () {
      spy = sinon.spy();
    });

    it('calls the function if setup has already run', function () {
      instance.setup();
      instance._afterSetup(spy);
      sinon.assert.called(spy);
    });

    it('does not call the function if setup has not run yet', function () {
      instance._afterSetup(spy);
      sinon.assert.notCalled(spy);
    });

    it('pushes the function onto _afterSetupFns', function () {
      instance._afterSetup(spy);
      expect(instance).to.have.property('_afterSetupFns')
      .to.have.property(0, spy);
    });
  });

  describe('setup', function () {
    it('calls the functions in _afterSetupFns one by one', function () {
      const spy = sinon.spy();
      const anotherSpy = sinon.spy();
      instance._afterSetup(spy);
      instance._afterSetup(anotherSpy);
      instance.setup();
      sinon.assert.called(spy);
      sinon.assert.called(anotherSpy);
    });

    it('changes setupRan from false to true', function () {
      expect(instance.setupRan).to.not.be.true;
      instance.setup();
      expect(instance.setupRan).to.be.true;
    });
  });

});