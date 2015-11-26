'use strict';

/**
 * @fileOverview This module exports a function which creates express midddleware to test if a user has certain permissions. It assumes that there is a `user` property defined on the `req` object. 
 * @example
 * const dmv = require('dmv');
 * const can  = dmv.expressMiddleware.can;
 * const hasRole  = dmv.expressMiddleware.hasRole;
 *
 * router.use(can('eat', 'bricks'));
 * router.use('/bricks/:id/eat');
 *
 * // less robust!
 * router.use(hasRole('mason'));
 * router.use('/bricks')
 *
 * // If the req.user doesn't have a role which gives it permission to eat bricks, a 401 will be sent.
 * @module  plugins/express
 */

/**
 * Default function to pull user off request object
 * @param  {Request} req
 * @param  {Response} res
 * @return {User}
 */
let getUser = function(req, res) {
  return req.user;
};

/**
 * Function to set method for pulling user off req or res
 * @param  {Function} cb your function to return user
 */
exports.user = function(cb) {
  getUser = cb;
};

/**
 * middleware factory to determine if req.user has permission to noun a verb
 * @function
 * @param  {string} verb
 * @param  {string} noun
 * @return {middleware}
 */
const can = exports.can = function(verb, noun) {
  return function(req, res, next) {
    const user = getUser(req, res);
    if(user.can(verb, noun)) { return next(); }
    const err = new Error('not authorized');
    err.status(401);
    next(err);
  };
};

/**
 * middleware factory to determine if req.user has a role
 * @function
 * @param  {string} verb
 * @param  {string} noun
 * @return {middleware}
 */
const hasRole = exports.hasRole = function(role) {
  return function(req, res, next) {
    const user = getUser(req, res);
    if(user.hasRole(role)) { return next(); }
    const err = new Error('not authorized');
    err.status(401);
    next(err);
  };
};