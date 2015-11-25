'use strict';
// we need to expose the dmv api
window.dmv = require('./index');
// angular code just needs to run. it will regester module with angular
require('./angularPlugin');