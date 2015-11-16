'use strict';
const Noun = require('./noun');
const Role = require('./role');

const roles = {};
const nouns = {};


/**
 * Regester a new noun
 * @param  {string} name - noun name
 * @param  {function} after - fn to run after setup. Passed noun instance. 
 * @return {noun}       returns noun instance
 */
exports.noun = function(name, after) {
  let noun = nouns[name] || new Noun(name);
  noun._afterSetup(after);
  return noun;
};

/**
 * Regester a new role
 * @param  {string} name - role name
 * @param  {function} after - fn to run after setup. Passed role instance. 
 * @return {role}       returns role instance
 */
exports.role = function(name, after) {
  let role = roles[name] || new Role(name);
  role._afterSetup(after);
  return role;
};

process.nextTick(function() {
  Object.keys(roles).concat(Object.keys(nouns))
    .forEach( (instance) => instance.setup() );
});