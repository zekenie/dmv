'use strict';

/**
 * @description An angular module that hooks into $stateChangeStart event on UI-Router and lets routes define permissions
 * @example
 * .factory('yourLoginFactory', function(authConfig) {
 *   // on login
 *   authConfig.setUser(yourUser) // <- YOUR USER MUST HAVE CAN METHOD
 * })
 * @module plugins/angular
 */

const dmv = require('./dmv');
const roleManager = require('./roleManager');
const angular = require('angular');
const _ = require('lodash');

angular.module('dmv', [])
  .factory('canPlugin', function() {
    return function(proto) {
      angular.extend(proto, {
        hasRole: function(r) {
          if (typeof r === 'string'){
            return this.roles.indexOf(r) !== -1;
          } else if (Array.isArray(r)) {
            let hasAllRoles = true;
            r.forEach(function (role) {
              if (this.roles.indexOf(role) === -1){
                hasAllRoles = false;
              }
            }, this);
            return hasAllRoles;
          }
        },
        can: function(verb, noun) {
          if(_.where(this.permissionsWhitelist, { verb, noun }).length) {
            return true;
          } else if(_.where(this.permissionsBlacklist, { verb, noun }).length) {
            return false;
          } else {
            return roleManager.can(this.roles, verb, noun);
          }
        }
      });
    };
  })
  .factory('authConfig', function($rootScope, $injector) {

    let userGetterMethod = function() {};
    const getUser = function() {
      return $injector.invoke(userGetterMethod);
    };

    return {
      getUser: function(fn) {
        userGetterMethod = fn;

        $rootScope.can = (verb, noun) => getUser().can(verb, noun);
        $rootScope.hasRole = role => getUser().hasRole(role);


        $rootScope.$on('$stateChangeStart', function(event, next) {
          const user = getUser();
          if(next && next.auth) {
            if(!user) {
              $rootScope.$broadcast('NOT_AUTHENTICATED');
              event.preventDefault();
              return;
            }
            if(next.auth === true) { return; }
            if(typeof next.auth === 'function') {
              if(!next.auth.call(event, user, next)) {
                event.preventDefault();
                $rootScope.$broadcast('NOT_AUTHORIZED');
              }
              return;
            }
            for(let verb in next.auth) {
              let noun = next.auth[verb];
              if(!user.can(verb, noun)) {
                event.preventDefault();
                $rootScope.$broadcast('NOT_AUTHORIZED');
                return;
              }
            }
          }
        });
      }
    };

  });