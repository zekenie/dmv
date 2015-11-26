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

const dmv = require('./index');
const roleManager = require('./roleManager');
const angular = require('angular');
const _ = require('lodash');

angular.module('dmv', [])
  .factory('canPlugin', function() {
    return function(proto) {
      angular.extend(proto, {
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
        $rootScope.$on('$stateChangeStart', function(event, next) {
          const user = getUser();
          if(next && next.auth) {
            if(!user) {
              $rootScope.$broadcast('NOT_AUTHENTICATED');
              event.preventDefault();
              return;
            }
            if(next.auth === true) { return; }
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