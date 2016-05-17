/******/ (function(modules) { // webpackBootstrap
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
	
	window.dmv = __webpack_require__(1);
	module.exports = window.dmv;
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
	
	var Noun = __webpack_require__(2);
	var Role = __webpack_require__(4);
	
	var RoleManager = __webpack_require__(7);
	var NounManager = __webpack_require__(6);
	var nouns = __webpack_require__(5);
	var roles = __webpack_require__(8);
	
	var addEntity = function addEntity(store, Constructor, name, after) {
	  if (!store.get(name)) {
	    store.set(name, new Constructor(name));
	  }
	  var instance = store.get(name);
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
	
	setTimeout(function () {
	  var entities = Array.from(nouns.values()).concat(Array.from(roles.values()));
	
	  entities.forEach(function (instance) {
	    return instance.setup();
	  });
	  exports.setupRan = true;
	}, 0);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * @class  Noun
	 */
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Noun = function (_require) {
	  _inherits(Noun, _require);
	
	  /**
	   * @param  {string} name - name of noun
	   * @return {noun}        - the created noun
	   */
	
	  function Noun(name) {
	    _classCallCheck(this, Noun);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Noun).call(this));
	
	    _this.name = name;
	    _this.verbs = new Set();
	    _this.permissions = {};
	    ['create', 'read', 'update', 'delete'].forEach(function (v) {
	      return _this.verb(v);
	    }, _this);
	    return _this;
	  }
	
	  /**
	   * Checks to see if noun has verb
	   * @param  {string}  verb
	   * @return {Boolean}
	   */
	
	
	  _createClass(Noun, [{
	    key: 'hasVerb',
	    value: function hasVerb(verb) {
	      return this.verbs.has(verb);
	    }
	
	    /**
	     * Adds verb to the set of posible verbs that can be authorized. For example, `post.can('like')` would add the verb 'like' to a noun 'post'
	     * @param  {string} verb
	     */
	
	  }, {
	    key: 'verb',
	    value: function verb(_verb) {
	      this.verbs.add(_verb);
	    }
	
	    /**
	     * Removes a verb from the set of possible verbs. Useful for removing default crud.
	     * @param  {string} verb
	     */
	
	  }, {
	    key: 'removeVerb',
	    value: function removeVerb(verb) {
	      this.verbs.delete(verb);
	    }
	
	    /**
	     * Authorizes a role to perform a verb.
	     * @param  {string} role
	     * @param  {string[]|string} verbs - Either the string '*', which authorizes all possible verbs to the given role, or an array of verbs to authorize.
	     */
	
	  }, {
	    key: 'authorize',
	    value: function authorize(role, verbs) {
	      var _this2 = this;
	
	      if (verbs === '*') {
	        verbs = this.verbs;
	      } else {
	        verbs = verbs.filter(function (v) {
	          return _this2.verbs.has(v);
	        }, this);
	      }
	      this.permissions[role] = this.permissions[role] || new Set();
	      verbs.forEach(function (v) {
	        return _this2.permissions[role].add(v);
	      });
	    }
	
	    /**
	     * Checks if a role is regestered and it has the permission
	     * @param  {string} role
	     * @param  {string} verb
	     * @return {boolean}
	     */
	
	  }, {
	    key: 'checkAuthorization',
	    value: function checkAuthorization(role, verb) {
	      return !!this.permissions[role] && this.permissions[role].has(verb);
	    }
	  }]);
	
	  return Noun;
	}(__webpack_require__(3));
	
	module.exports = Noun;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	module.exports = function () {
	  function AfterSetup() {
	    _classCallCheck(this, AfterSetup);
	
	    this._afterSetupFns = [];
	  }
	
	  _createClass(AfterSetup, [{
	    key: '_afterSetup',
	    value: function _afterSetup(fn) {
	      if (this.setupRan) {
	        fn.call(this, this);
	      }
	      this._afterSetupFns.push(fn);
	    }
	  }, {
	    key: 'setup',
	    value: function setup() {
	      var _this = this;
	
	      this._afterSetupFns.forEach(function (fn) {
	        return fn.call(_this, _this);
	      }, this);
	      this.setupRan = true;
	    }
	  }]);
	
	  return AfterSetup;
	}();

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * @class Role
	 */
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var nouns = __webpack_require__(5);
	
	var Role = function (_require) {
	  _inherits(Role, _require);
	
	  function Role(name) {
	    _classCallCheck(this, Role);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Role).call(this));
	
	    _this.name = name;
	    return _this;
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
	
	
	  _createClass(Role, [{
	    key: 'can',
	    value: function can(verb, noun) {
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
	
	  }, {
	    key: 'authorize',
	    value: function authorize(verbs, noun) {
	      if (!nouns.has(noun)) {
	        throw new Error('cannot authorize ' + noun);
	      }
	      nouns.get(noun).authorize(this.name, verbs);
	    }
	  }]);
	
	  return Role;
	}(__webpack_require__(3));
	
	module.exports = Role;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var NounManager = __webpack_require__(6);
	
	module.exports = new NounManager();

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	/** @todo  extends Map */
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var NounManager = function NounManager() {
	  _classCallCheck(this, NounManager);
	
	  this.map = new Map();
	  this.set = this.map.set.bind(this.map);
	  this.get = this.map.get.bind(this.map);
	  this.has = this.map.has.bind(this.map);
	  this.values = this.map.values.bind(this.map);
	};
	
	module.exports = NounManager;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * @module  RoleManager
	 */
	
	/** @todo  extends Map */
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var RoleManager = function () {
	  function RoleManager() {
	    _classCallCheck(this, RoleManager);
	
	    this.map = new Map();
	    this.set = this.map.set.bind(this.map);
	    this.get = this.map.get.bind(this.map);
	    this.has = this.map.has.bind(this.map);
	    this.values = this.map.values.bind(this.map);
	  }
	
	  _createClass(RoleManager, [{
	    key: 'can',
	    value: function can(roles, verb, noun) {
	      var _this = this;
	
	      return roles.every(function (r) {
	        return _this.has(r);
	      }) && roles.some(function (r) {
	        return _this.get(r).can(verb, noun);
	      });
	    }
	  }]);
	
	  return RoleManager;
	}();
	
	module.exports = RoleManager;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var RoleManager = __webpack_require__(7);
	
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
	
	var dmv = __webpack_require__(1);
	var roleManager = __webpack_require__(7);
	var canMixin = __webpack_require__(10);
	
	angular.module('dmv', []).factory('canPlugin', function () {
	  return function (proto) {
	    angular.extend(proto, canMixin);
	  };
	}).factory('authConfig', ["$rootScope", "$injector", function ($rootScope, $injector) {
	
	  var userGetterMethod = function userGetterMethod() {};
	  var _getUser = function _getUser() {
	    return $injector.invoke(userGetterMethod);
	  };
	
	  return {
	    getUser: function getUser(fn) {
	      userGetterMethod = fn;
	
	      $rootScope.can = function (verb, noun) {
	        return _getUser().can(verb, noun);
	      };
	      $rootScope.hasRole = function (role) {
	        return _getUser().hasRole(role);
	      };
	
	      $rootScope.$on('$stateChangeStart', function (event, next) {
	        var user = _getUser();
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
	          for (var verb in next.auth) {
	            var noun = next.auth[verb];
	            if (!user.can(verb, noun)) {
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

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var roles = __webpack_require__(8);
	
	var onPermissionList = function onPermissionList(list, verb, noun) {
	  return list && !!list.find(function (item) {
	    return item.verb === verb && item.noun === noun;
	  });
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
	  var _this = this;
	
	  if (typeof r === 'string') {
	    return this.roles.indexOf(r) !== -1;
	  } else if (Array.isArray(r)) {
	    return !r.some(function (role) {
	      return _this.roles.indexOf(role) === -1;
	    });
	  }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=browser.js.map