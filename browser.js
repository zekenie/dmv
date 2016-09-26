(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["dmv"] = factory();
	else
		root["dmv"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// we need to expose the dmv api
	
	module.exports = __webpack_require__(1);
	// angular code just needs to run. it will register module with angular
	if (typeof angular !== 'undefined') {
	  __webpack_require__(9);
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileOverview This is the root of the project. It allows users to register nouns and roles with dmv. It also exports plugins.
	 * @module main
	 * @requires Noun
	 * @requires Role
	 * @requires RoleManager
	 * @requires NounManager
	 */
	
	'use strict';
	
	const Noun = __webpack_require__(2);
	const Role = __webpack_require__(4);
	
	const RoleManager = __webpack_require__(7);
	const NounManager = __webpack_require__(6);
	const nouns = __webpack_require__(5);
	const roles = __webpack_require__(8);
	
	const addEntity = function (store, Constructor, name, after) {
	  if (!store.get(name)) {
	    store.set(name, new Constructor(name));
	  }
	  const instance = store.get(name);
	  if (this.setupRan) {
	    instance.setupRan = true;
	  }
	  if (after) {
	    instance._afterSetup(after);
	  }
	  return instance;
	};
	
	/**
	 * Register a new noun
	 * @param  {string} name - noun name
	 * @param  {function} after - fn to run after setup. Passed noun instance. 
	 * @return {noun}       returns noun instance
	 */
	exports.noun = addEntity.bind(exports, nouns, Noun);
	
	/**
	 * Register a new role
	 * @param  {string} name - role name
	 * @param  {function} after - fn to run after setup. Passed role instance. 
	 * @return {role}       returns role instance
	 */
	exports.role = addEntity.bind(exports, roles, Role);
	
	/**
	 * Gets all registered nouns. Must be called after setup
	 * @return {Iterator<Noun>}
	 */
	exports.getAllNouns = function () {
	  return Array.from(nouns.values());
	};
	
	exports.getNoun = nouns.get.bind(nouns);
	exports.getRole = roles.get.bind(roles);
	
	/**
	* Empty nouns and roles, resetting dmv. Use with caution.
	*/
	exports.reset = function () {
	  nouns.clear();
	  roles.clear();
	};
	
	setTimeout(function () {
	  var entities = Array.from(nouns.values()).concat(Array.from(roles.values()));
	  entities.forEach(instance => instance.setup());
	  exports.setupRan = true;
	}, 0);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * @class  Noun
	 */
	
	class Noun extends __webpack_require__(3) {
	  /**
	   * @param  {string} name - name of noun
	   * @return {noun}        - the created noun
	   */
	  constructor(name) {
	    super();
	    this.name = name;
	    this.verbs = new Set();
	    this.permissions = {};
	    ['create', 'read', 'update', 'delete'].forEach(v => this.verb(v), this);
	  }
	
	  /**
	   * Checks to see if noun has verb
	   * @param  {string}  verb
	   * @return {Boolean}
	   */
	  hasVerb(verb) {
	    return this.verbs.has(verb);
	  }
	
	  /**
	   * Adds verb to the set of posible verbs that can be authorized. For example, `post.can('like')` would add the verb 'like' to a noun 'post'
	   * @param  {string} verb
	   */
	  verb(verb) {
	    this.verbs.add(verb);
	  }
	
	  /**
	   * Removes a verb from the set of possible verbs. Useful for removing default crud.
	   * @param  {string} verb
	   */
	  removeVerb(verb) {
	    this.verbs.delete(verb);
	  }
	
	  /**
	   * Authorizes a role to perform a verb.
	   * @param  {string} role
	   * @param  {string[]|string} verbs - Either the string '*', which authorizes all possible verbs to the given role, or an array of verbs to authorize.
	   */
	  authorize(role, verbs) {
	    if (verbs === '*') {
	      verbs = this.verbs;
	    } else {
	      verbs = verbs.filter(v => this.verbs.has(v), this);
	    }
	    this.permissions[role] = this.permissions[role] || new Set();
	    verbs.forEach(v => this.permissions[role].add(v));
	  }
	
	  /**
	   * Checks if a role is regestered and it has the permission
	   * @param  {string} role
	   * @param  {string} verb
	   * @return {boolean}
	   */
	  checkAuthorization(role, verb) {
	    return !!this.permissions[role] && this.permissions[role].has(verb);
	  }
	
	}
	
	module.exports = Noun;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = class AfterSetup {
	  constructor() {
	    this._afterSetupFns = [];
	  }
	
	  _afterSetup(fn) {
	    if (this.setupRan) {
	      fn.call(this, this);
	    }
	    this._afterSetupFns.push(fn);
	  }
	
	  setup() {
	    this._afterSetupFns.forEach(fn => fn.call(this, this), this);
	    this.setupRan = true;
	  }
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * @class Role
	 */
	
	const nouns = __webpack_require__(5);
	
	class Role extends __webpack_require__(3) {
	  constructor(name) {
	    super();
	    this.name = name;
	  }
	
	  /**
	   * Checks if a given noun can perform a given verb
	   * @function
	   * @example
	   * someRole.can('eat','brick'); // -> true
	   * @param  {string} verb
	   * @param  {string} noun
	   * @return {boolean}
	   */
	  can(verb, noun) {
	    if (!nouns.has(noun)) {
	      return false;
	    }
	    return nouns.get(noun).checkAuthorization(this.name, verb);
	  }
	
	  /**
	   * Authorizes this role to perform an array of actions on a verb
	   * @function
	   * @see  Noun#authorize
	   * @example  someRole.authorize(['create','read'], 'kitten');
	   * @param  {String[]|String} verbs - Either an array of verbs already regestered with the noun, or `'*'` to allow access to all verbs
	   * @param  {String} noun
	   */
	  authorize(verbs, noun) {
	    if (!nouns.has(noun)) {
	      throw new Error(`cannot authorize ${ noun }`);
	    }
	    nouns.get(noun).authorize(this.name, verbs);
	  }
	}
	
	module.exports = Role;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	const NounManager = __webpack_require__(6);
	
	module.exports = new NounManager();

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	/** @todo  extends Map */
	
	class NounManager {
	  constructor() {
	    this.map = new Map();
	    this.set = this.map.set.bind(this.map);
	    this.get = this.map.get.bind(this.map);
	    this.has = this.map.has.bind(this.map);
	    this.values = this.map.values.bind(this.map);
	    this.clear = this.map.clear.bind(this.map);
	  }
	}
	
	module.exports = NounManager;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * @module  RoleManager
	 */
	
	/** @todo  extends Map */
	
	class RoleManager {
	
	  constructor() {
	    this.map = new Map();
	    this.set = this.map.set.bind(this.map);
	    this.get = this.map.get.bind(this.map);
	    this.has = this.map.has.bind(this.map);
	    this.values = this.map.values.bind(this.map);
	    this.clear = this.map.clear.bind(this.map);
	  }
	  can(roles, verb, noun) {
	    return roles.every(r => this.has(r)) && roles.some(r => this.get(r).can(verb, noun));
	  }
	}
	
	module.exports = RoleManager;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	const RoleManager = __webpack_require__(7);
	
	module.exports = new RoleManager();

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

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
	
	const dmv = __webpack_require__(1);
	const roleManager = __webpack_require__(7);
	const canMixin = __webpack_require__(10);
	
	angular.module('dmv', []).factory('canPlugin', function () {
	  return function (proto) {
	    angular.extend(proto, canMixin);
	  };
	}).factory('authConfig', ["$rootScope", "$injector", function ($rootScope, $injector) {
	
	  let userGetterMethod = function () {};
	  const getUser = function () {
	    return $injector.invoke(userGetterMethod);
	  };
	
	  return {
	    getUser: function (fn) {
	      userGetterMethod = fn;
	
	      $rootScope.can = (verb, noun) => {
	        try {
	          return getUser().can(verb, noun);
	        } catch (e) {
	          return false;
	        }
	      };
	      $rootScope.hasRole = role => {
	        try {
	          return getUser().hasRole(role);
	        } catch (e) {
	          return false;
	        }
	      };
	
	      $rootScope.$on('$stateChangeStart', function (event, next) {
	        const user = getUser();
	        if (next && next.auth) {
	          if (!user) {
	            $rootScope.$broadcast('NOT_AUTHENTICATED');
	            event.preventDefault();
	            return;
	          }
	          if (next.auth === true) {
	            return;
	          }
	          if (typeof next.auth === 'function') {
	            if (!next.auth.call(event, user, next)) {
	              event.preventDefault();
	              $rootScope.$broadcast('NOT_AUTHORIZED');
	            }
	            return;
	          }
	          for (let verb in next.auth) {
	            if (next.auth.hasOwnProperty(verb)) {
	              let noun = next.auth[verb];
	              if (!user.can(verb, noun)) {
	                event.preventDefault();
	                $rootScope.$broadcast('NOT_AUTHORIZED');
	                return;
	              }
	            }
	          }
	        }
	      });
	    }
	  };
	}]);

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	const roles = __webpack_require__(8);
	
	const onPermissionList = (list, verb, noun) => {
	  return list && !!list.find(item => item.verb === verb && item.noun === noun);
	};
	
	/**
	 * Checks if a user has the ability to perform an action on a noun
	 * @memberOf plugins/mongoose
	 * @param  {string} verb
	 * @param  {string} noun
	 * @return {boolean}
	 */
	exports.can = function (verb, noun) {
	  if (onPermissionList(this.permissionWhiteList, verb, noun)) {
	    return true;
	  } else if (onPermissionList(this.permissionBlackList, verb, noun)) {
	    return false;
	  } else {
	    return roles.can(this.roles, verb, noun);
	  }
	};
	
	/**
	 * Determines if user has role or roles
	 * @param  {String|Array}  r role
	 * @return {Boolean}
	 */
	exports.hasRole = function (r) {
	  if (typeof r === 'string') {
	    return this.roles.indexOf(r) !== -1;
	  } else if (Array.isArray(r)) {
	    return !r.some(role => this.roles.indexOf(role) === -1);
	  }
	};

/***/ }
/******/ ])
});
;
//# sourceMappingURL=browser.js.map