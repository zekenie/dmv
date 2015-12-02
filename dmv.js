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
  if(after) { noun._afterSetup(after); }
  return noun;
};

/**
 * Regester a new role
 * @param  {string} name - role name
 * @param  {function} after - fn to run after setup. Passed role instance. 
 * @return {role}       returns role instance
 */
exports.role = function(name, after) {
  let role = roleManager.get(name) || roleManager.set(name, new Role(name));
  if(after) { role._afterSetup(after); }
  return role;
};

/**
 * Returns the mongoose plugin function.
 * @see {@link module:plugins/mongoose}
 * @todo find another way to put mongoose in
 */
// exports.mongoosePlugin = require('./mongoosePlugin');

setTimeout(function() {
  roleManager.getAll().concat(nounManager.getAll())
    .forEach( (instance) => instance.setup() );
}, 0);