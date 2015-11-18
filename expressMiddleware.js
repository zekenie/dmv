'use strict';

/**
 * @fileOverview This module exports a function which creates express midddleware to test if a user has certain permissions. It assumes that there is a `user` property defined on the `req` object. 
 * @example
 * const can  = require('dmv').expressMiddleware;
 *
 * router.use(can('eat', 'bricks'));
 * router.use('/bricks/:id/eat');
 *
 * // If the req.user doesn't have a role which gives it permission to eat bricks, a 401 will be sent.
 * @module  plugins/express
 */

/**
 * middleware factory to determine if req.user has a role
 * @function
 * @param  {string} verb
 * @param  {string} noun
 * @return {middleware}
 */
const expressPlugin = module.exports = function(verb, noun) {
  return function(req, res, next) {
    if(req.user.can(verb, noun)) { return next(); }
    const err = new Error('not authorized');
    err.status(401);
    next(err);
  };
};