/**
 * @fileOverview This is the root of the project. It allows users to regester nouns and roles with dmv. It also exports plugins.
 * @module main
 * @requires Noun
 * @requires Role
 * @requires RoleManager
 * @requires NounManager
 */

'use strict';
const Noun = require('./noun');
const Role = require('./role');

const RoleManager = require('./roleManager');
const NounManager = require('./nounManager');
const nouns = require('./nouns');
const roles = require('./roles');

const addEntitiy = (store, Constructor, name, after) => {
  if(!store.get(name)) { store.set(name, new Constructor(name)); }
  const instance = store.get(name);
  if(this.setupRan) { instance.setupRan = true; }
  if(after) { instance._afterSetup(after); }
  return instance;
}

/**
 * Regester a new noun
 * @param  {string} name - noun name
 * @param  {function} after - fn to run after setup. Passed noun instance. 
 * @return {noun}       returns noun instance
 */
exports.noun = addEntitiy.bind(exports, nouns, Noun);

/**
 * Regester a new role
 * @param  {string} name - role name
 * @param  {function} after - fn to run after setup. Passed role instance. 
 * @return {role}       returns role instance
 */
exports.role = addEntitiy.bind(exports, roles, Role);

/**
 * Gets all regestered nouns. Must be called after setup
 * @return {Iterator<Noun>}
 */
exports.getAllNouns = function() {
  return nouns.values();
};

exports.getNoun = nouns.get.bind(nouns);
exports.getRole = roles.get.bind(roles);


setTimeout(function() {
  var entities = Array.from(nouns.values()).concat(Array.from(nouns.values()));
  
  entities.forEach( (instance) => instance.setup() );
  exports.setupRan = true;
}, 0);