/**
 * @fileOverview This is the root of the project. It allows users to regester nouns and roles with dmv. It also exports plugins.
 * @module main
 * @requires Noun
 * @requires Role
 * @requires roleManager
 * @requires nounManager
 */

'use strict';
const Noun = require('./noun');
const Role = require('./role');

const roleManager = require('./roleManager');
const nounManager = require('./nounManager');

/**
 * Regester a new noun
 * @param  {string} name - noun name
 * @param  {function} after - fn to run after setup. Passed noun instance. 
 * @return {noun}       returns noun instance
 */
exports.noun = function(name, after) {
  let noun = nounManager.get(name) || nounManager.set(name, new Noun(name));
  if(this.setupRan) { noun.setupRan = true; }
  if(after) { noun._afterSetup(after); }
  return noun;
};

/**
 * Gets all regestered nouns. Must be called after setup
 * @return {Array<Noun>}
 */
exports.getAllNouns = function() {
  return nounManager.getAll();
};

exports.getNoun = nounManager.get.bind(nounManager);
exports.getRole = roleManager.get.bind(roleManager);

/**
 * Regester a new role
 * @param  {string} name - role name
 * @param  {function} after - fn to run after setup. Passed role instance. 
 * @return {role}       returns role instance
 */
exports.role = function(name, after) {
  let role = roleManager.get(name) || roleManager.set(name, new Role(name));
  if(this.setupRan) { role.setupRan = true; }
  if(after) { role._afterSetup(after); }
  return role;
};

setTimeout(function() {
  var entities = roleManager.getAll().concat(nounManager.getAll());
  
  entities.forEach( (instance) => instance.setup() );
  exports.setupRan = true;
}, 0);