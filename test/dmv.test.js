'use strict';
const mock = require('mock-require');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const Role = require('../Role');
let nouns = require('../nouns');
let roles = require('../roles');
let dmv = require('../dmv');

for (let i = 0; i < 2; i++) {

  // Testing is performed in two passes. On the first pass (unit testing),
  // dependencies are stubbed or mocked. On the second pass (integration testing),
  // dependencies are fulfilled by DMV's actual modules.

  describe(i === 0 ? 'dmv unit testing' : 'dmv integration testing', function () {

    before(i === 0 ? 'set up mocks' : 'require live dependencies', function () {
      if (i === 0) setUpMocks();
      else restoreMocks();

      function setUpMocks() {
        const entityConstructor = function (name) {
          this.name = name;
          this._afterSetup = function (after) {
            after.call(this, this);
          };
          this.setup = function () {};
          this.setupRan = false;
        };
        nouns = new Map();
        roles = new Map();
        mock('../nouns', nouns);
        mock('../roles', roles);
        mock('../noun', entityConstructor);
        mock('../role', entityConstructor);
      }

      function restoreMocks() {
        mock.stopAll();
        nouns = require('../nouns');
        roles = require('../roles');
      }

      dmv = mock.reRequire('../dmv');
      dmv.reset();
    });

    describe('noun', function () {
      let cat;
      let spy;

      beforeEach('invoke noun', function () {
        spy = sinon.spy();
        cat = dmv.noun('cat', spy);
      });

      it('adds a noun to nouns', function () {
        const retrieved = nouns.get('cat');
        expect(retrieved).to.be.an('object');
        expect(retrieved).to.have.property('name', 'cat');
      });

      it('changes setupRan to true for all newly added nouns', function () {
        setTimeout(function () {
          expect(cat.setupRan).to.be.true;
        }, 0);
      });

      it('runs any functions passed in as the "after" parameter', function () {
        setTimeout(function () {
          sinon.assert.calledWith(spy, cat);
        }, 0);
      });

      it('returns the noun', function () {
        expect(cat).to.be.an('object');
        expect(cat).to.have.property('name', 'cat');
      });
    });

    describe('role', function () {
      let owner;
      let spy;

      before('invoke role', function () {
        spy = sinon.spy();
        owner = dmv.role('owner', spy);
      });

      it('adds a role to roles', function () {
        const retrieved = roles.get('owner');
        expect(retrieved).to.be.an('object');
        expect(retrieved).to.have.property('name', 'owner');
      });

      it('changes setupRan to true for all newly added roles', function () {
        setTimeout(function () {
          expect(owner.setupRan).to.be.true;
        }, 0);
      });

      it('runs any functions passed in as the "after" parameter', function () {
        sinon.assert.calledWith(spy, owner);
      });

      it('returns the role', function () {
        expect(owner).to.be.an('object');
        expect(owner).to.have.property('name', 'owner');
      });
    });

    describe('getAllNouns', function () {
      let nouns;

      before('register nouns', function () {
        nouns = ['cat', 'bat', 'rat', 'mat'];
        nouns.forEach((noun) => dmv.noun(noun));
      });

      it('returns all nouns that have been registered', function () {
        const allNouns = dmv.getAllNouns();
        let counter = 0;
        for (let noun of allNouns) {
          counter++;
          expect(noun).to.be.an('object');
          expect(noun).to.have.property('setup');
        }
        expect(counter).to.equal(4);
      });
    });

    describe('getNoun', function () {
      it('returns an undefined value if a noun is not registered', function () {
        let dog = dmv.getNoun('dog');
        expect(dog).to.be.undefined;
      });

      it('returns a noun if it is registered', function () {
        dmv.noun('cat');
        let cat = dmv.getNoun('cat');
        expect(cat).to.be.an('object');
        expect(cat).to.have.property('name', 'cat');
      });
    });

    describe('getRole', function () {
      it('returns an undefined value if a noun is not registered', function () {
        let user = dmv.getRole('user');
        expect(user).to.be.undefined;
      });

      it('returns a noun if it is registered', function () {
        dmv.role('owner');
        let owner = dmv.getRole('owner');
        expect(owner).to.be.an('object');
        expect(owner).to.have.property('name', 'owner');
      });
    });

    describe('setup functionality', function () {
      it('runs setup on all entities that are already stored by nouns and roles', function () {
        console.log('Nouns:', nouns.values(), "Roles:", roles.values());
      });
    });

  });

}
