'use strict';
const mock = require('mock-require');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
let nouns = require('../nouns');
let roles = require('../roles');
let dmv = require('../dmv');

const Entity = function (name) {
  this.name = name;
  this._afterSetup = function (after) {
    after.call(this, this);
  };
  this.setup = sinon.spy();
  this.setupRan = false;
};

for (let i = 0; i < 2; i++) {

  // Testing is performed in two passes. On the first pass (unit testing),
  // dependencies are stubbed or mocked. On the second pass (integration testing),
  // dependencies are fulfilled by DMV's actual modules.

  describe(i === 0 ? 'dmv unit testing' : 'dmv integration testing', () => {

    before(i === 0 ? 'set up mocks' : 'require live dependencies', () => {
      if (i === 0) {
        mock('../noun', Entity);
        mock('../role', Entity);
        mock('../nouns', nouns = new Map());
        mock('../roles', roles = new Map());
      } else {
        mock.stopAll();
        nouns = require('../nouns');
        roles = require('../roles');
      }

      // prefill nouns and roles to prepare testing for setup functionality
      ['dog', 'bog', 'cog', 'fog'].forEach((noun) => nouns.set(noun, new Entity(noun)));
      ['user', 'admin', 'guest'].forEach((role) => roles.set(role, new Entity(role)));

      dmv = mock.reRequire('../dmv');
    });

    describe('setup functionality', () => {
      before('wait for setTimeout to run', (done) => {
        let doneCalled = false;
        setInterval(() => {
          if (dmv.setupRan && !doneCalled) {
            done();
            doneCalled = true;
          }
        }, 0.01);
      });

      after('empty nouns and roles', () => {
        nouns.clear();
        roles.clear();
      });

      it('runs setup on all entities that are already stored by nouns and roles', (done) => {
        setTimeout(() => {
          const allNouns = nouns.values();
          const allRoles = roles.values();
          for (const noun of allNouns) {
            sinon.assert.calledOnce(noun.setup);
          }
          for (const role of allRoles) {
            sinon.assert.calledOnce(role.setup);
          }
          done();
        });
      });
    });

    describe('noun', () => {
      let cat;
      let spy;

      before('invoke noun', () => {
        spy = sinon.spy();
        cat = dmv.noun('cat', spy);
      });

      after('empty nouns', () => {
        nouns.clear();
      });

      it('adds a noun to nouns', () => {
        const retrieved = nouns.get('cat');
        expect(retrieved).to.be.an('object');
        expect(retrieved).to.have.property('name', 'cat');
      });

      it('changes setupRan to true for all newly added nouns', () => {
        expect(cat.setupRan).to.be.true;
      });

      it('runs any functions passed in as the "after" parameter', function () {
        sinon.assert.calledWith(spy, cat);
      });

      it('returns the noun', () => {
        expect(cat).to.be.an('object');
        expect(cat).to.have.property('name', 'cat');
      });
    });

    describe('role', () => {
      let owner;
      let spy;

      before('invoke role', () => {
        spy = sinon.spy();
        owner = dmv.role('owner', spy);
      });

      after('empty roles', () => {
        roles.clear();
      });

      it('adds a role to roles', () => {
        const retrieved = roles.get('owner');
        expect(retrieved).to.be.an('object');
        expect(retrieved).to.have.property('name', 'owner');
      });

      it('changes setupRan to true for all newly added roles', () => {
        expect(owner.setupRan).to.be.true;
      });

      it('runs any functions passed in as the "after" parameter', () => {
        sinon.assert.calledWith(spy, owner);
      });

      it('returns the role', () => {
        expect(owner).to.be.an('object');
        expect(owner).to.have.property('name', 'owner');
      });
    });

    describe('getAllNouns', () => {

      before('register nouns', () => {
        ['cat', 'bat', 'rat', 'mat'].forEach((noun) => dmv.noun(noun));
      });

      after('empty nouns', () => {
        nouns.clear();
      });

      it('returns all nouns that have been registered', () => {
        const allNouns = dmv.getAllNouns();
        let counter = 0;
        for (const noun of allNouns) {
          counter++;
          expect(noun).to.be.an('object');
          expect(noun).to.have.property('setup');
        }
        expect(counter).to.equal(4);
      });
    });

    describe('getNoun', () => {

      after('empty nouns', () => {
        nouns.clear();
      });

      it('returns an undefined value if a noun is not registered', () => {
        const dog = dmv.getNoun('dog');
        expect(dog).to.be.undefined;
      });

      it('returns a noun if it is registered', () => {
        dmv.noun('cat');
        const cat = dmv.getNoun('cat');
        expect(cat).to.be.an('object');
        expect(cat).to.have.property('name', 'cat');
      });
    });

    describe('getRole', () => {

      after('empty roles', () => {
        roles.clear();
      });

      it('returns an undefined value if a role is not registered', () => {
        const user = dmv.getRole('user');
        expect(user).to.be.undefined;
      });

      it('returns a role if it is registered', () => {
        dmv.role('owner');
        const owner = dmv.getRole('owner');
        expect(owner).to.be.an('object');
        expect(owner).to.have.property('name', 'owner');
      });
    });

    describe('reset', () => {
      before('prefill nouns and roles', () => {
        ['dog', 'bog', 'cog', 'fog'].forEach((noun) => nouns.set(noun, new Entity(noun)));
        ['user', 'admin', 'guest'].forEach((role) => roles.set(role, new Entity(role)));
      });

      it('empties the nouns and roles collections', () => {
        dmv.reset();
        const allNouns = nouns.values();
        const allRoles = roles.values();
        let counter = 0;

        for (const noun of allNouns) {
          counter++;
        }
        expect(counter).to.equal(0);

        counter = 0;
        for (const role of allRoles) {
          counter++;
        }
        expect(counter).to.equal(0);
      });
    });
  });
}
