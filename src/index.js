'use strict';

var Dispatcher = require('flux/lib/Dispatcher');
var extend = require('amp-extend');
var queue = require('queue');

var _action_queue = queue({
  concurrency: 1
});

var LCARS = new Dispatcher();

extend(LCARS, {

  _dispatch: LCARS,

  /**
   * @param {object} action
   */
  dispatch: function(action){

    _action_queue.push(function(cb) {
      this._dispatch(action);
      cb();
    }.bind(this));

    _action_queue.start();

  }

});

module.exports = LCARS;