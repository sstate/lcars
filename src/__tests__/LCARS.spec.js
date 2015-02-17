'use strict';

jest.dontMock('../index');
jest.dontMock('flux/lib/Dispatcher');
jest.dontMock('queue');

jest.setMock('events', {
  EventEmitter: function() {
    this.emit = function() {};
  }
});

describe('LCARS', function() {

  var LCARS;
  var dispatched_actions;

  var ACTIONS = {
    SINGLE: 'SINGLE',
    DOUBLE: 'DOUBLE',
    A: 'A',
    B: 'B',
    COMPLEX: 'COMPLEX'
  };

  var dispatch = function(type) {
    LCARS.dispatch({
      type: type
    });
  };

  var action_listener = function(action) {

    switch(action.type) {
      case ACTIONS.SINGLE:
      case ACTIONS.A:
      case ACTIONS.B:
        break;
      case ACTIONS.DOUBLE:
        dispatch(ACTIONS.SINGLE);
        break;
      case ACTIONS.COMPLEX:
        dispatch(ACTIONS.B);
        dispatch(ACTIONS.DOUBLE);
        dispatch(ACTIONS.A);
    }
    dispatched_actions.push(action.type);
  };

  beforeEach(function() {
    dispatched_actions = [];
    LCARS = require('../index');
    LCARS.register(action_listener);
  });

  describe('dispatch function', function() {
    it('immediately executes dispatched actions', function() {
      dispatch(ACTIONS.SINGLE);
      expect(dispatched_actions).toEqual([ACTIONS.SINGLE]);
    });

    it('waits to dispatch actions-within-actions until the current dispatch is finished', function() {
      dispatch(ACTIONS.DOUBLE);
      expect(dispatched_actions).toEqual([ACTIONS.SINGLE, ACTIONS.DOUBLE]);
    });

    it('dispatches complex chains of actions in the order they were requested', function() {
      dispatch(ACTIONS.COMPLEX);
      expect(dispatched_actions).toEqual([ACTIONS.B, ACTIONS.SINGLE, ACTIONS.DOUBLE, ACTIONS.A, ACTIONS.COMPLEX]);
    });
  });
});