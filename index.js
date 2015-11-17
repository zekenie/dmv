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

exports.mongoosePlugin = require('./mongoosePlugin');

process.nextTick(function() {
  roleManager.getAll().concat(nounManager.getAll())
    .forEach( (instance) => instance.setup() );
});