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

const rollManager = require('./index');
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
  .factory('authConfig', ['$rootScope', function($rootScope) {
    let user;

    return {
      setUser: function(u) {
        if(u && u.can && typeof u.can === 'function') {
          user = u;
          return;
        }
        throw 'user must have a can method';
      },
      enable: function() {
        $rootScope.$on('$stateChangeStart', function(event, next) {
          if(next && next.auth) {
            if(!user) {
              $rootScope.$broadcast('NOT_AUTHENTICATED');
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

  }]);