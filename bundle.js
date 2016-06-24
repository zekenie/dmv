'use strict';

// we need to expose the dmv api
module.exports = require('./dmv');
// angular code just needs to run. it will register module with angular
if(typeof angular !== 'undefined') {
  require('./angularPlugin');
}