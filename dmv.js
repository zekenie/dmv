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

/**
 * Regester a new noun
 * @param  {string} name - noun name
 * @param  {function} after - fn to run after setup. Passed noun instance. 
 * @return {noun}       returns noun instance
 */
exports.noun = function(name, after) {
  if(!nouns.get(name)) { nouns.set(name, new Noun(name)); }
  const noun = nouns.get(name);
  if(this.setupRan) { noun.setupRan = true; }
  if(after) { noun._afterSetup(after); }
  return noun;
};

/**
 * Gets all regestered nouns. Must be called after setup
 * @return {Iterator<Noun>}
 */
exports.getAllNouns = function() {
  return nouns.values();
};

exports.getNoun = nouns.get.bind(nouns);
exports.getRole = roles.get.bind(roles);

/**
 * Regester a new role
 * @param  {string} name - role name
 * @param  {function} after - fn to run after setup. Passed role instance. 
 * @return {role}       returns role instance
 */
exports.role = function(name, after) {
  if(!roles.get(name)) { roles.set(name, new Role(name)); }
  const role = roles.get(name);
  if(this.setupRan) { role.setupRan = true; }
  if(after) { role._afterSetup(after); }
  return role;
};

setTimeout(function() {
  var entities = Array.from(nouns.values()).concat(Array.from(nouns.values()));
  
  entities.forEach( (instance) => instance.setup() );
  exports.setupRan = true;
}, 0);