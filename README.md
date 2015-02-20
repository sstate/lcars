# LCARS

![LCARS](http://i.imgur.com/u9eSSiW.jpg)

A queued flux dispatcher


Demo [[source](https://github.com/sstate/examples#flux-todomvc---lcars-and-cargobay)] [[live demo](http://sstate.github.io/examples/examples/flux-todomvc/)]

## Install

`npm install lcars`

## Usage

LCARS is a dispatcher that uses [facebook's flux dispatcher](https://github.com/sstate/lcars/blob/master/src/index.js#L3). We are not re-creating our own version of flux, but providing some of the implementation details you might need to get started with flux.

It is common in flux applications to have _one_ dispatcher. That is how we use it, but in practice, you _could_ have more than one. We feel to follow flux, and to make your application easier to follow, it is a good practice to only have one. Be cautious of this. Please read [this if you havent yet.](http://facebook.github.io/react/blog/2014/07/30/flux-actions-and-the-dispatcher.html#why-we-need-a-dispatcher)

The place that dispatchers are mostly used is in your [Action Creator](http://facebook.github.io/react/blog/2014/07/30/flux-actions-and-the-dispatcher.html#actions-and-actioncreators) and [Stores](http://facebook.github.io/flux/docs/overview.html#stores).

#### Example

```
# /actions/HelloWorldActionCreator.js

var LCARS = require('lcars');
var HelloWorldConstants = require('./../constants/HelloWorldConstants');

var HelloWorldActionCreator = {
  updateAge: function(data){
    LCARS.dispatch({
      type: HelloWorldConstants.DemoActions.SET_AGE,
      data: data
    })
  }
};

module.exports = HelloWorldActionCreator;
```

When you call `HelloWorldActionCreator.updateAge({age: 30})`, your dispatcher (LCARS) will register callbacks that you can respond to.

```
# /stores/HelloWorldStore.js

'use strict';

var LCARS = require('lcars');
var CargoBay = require('cargo-bay');
var HelloWorldConstants = require('./../constants/HelloWorldConstants');
var merge = require('amp-merge');

var HelloWorldData = {
  _data: {
    name: "Bob",
    age: undefined
  },
  clonedData: function() {
    return JSON.parse(JSON.stringify(this._data));
  }
};

var _setAge = function(age){
  var data = HelloWorldData.clonedData();
  data.age = age;
  HelloWorldData._data = data;
  return HelloWorldData.clonedData();
};

var HelloWorldStore =  merge(CargoBay, {
  getDataFromStore: function(){
    return HelloWorldData.clonedData();
  }
});

HelloWorldStore.dispatchToken = LCARS.register(function(action){
  switch (action.type){
    case HelloWorldConstants.DemoActions.SET_AGE:
      _setAge(action.data.age);
      HelloWorldStore.emitChange();
      break;
  }
});

module.exports = HelloWorldStore;
```

You can see an example of this in [freighter](https://github.com/sstate/freighter/tree/master/examples).

#### To contribute

```

npm install

npm test
```

