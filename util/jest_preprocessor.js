// preprocessor.js
var ReactTools = require('react-tools');
module.exports = {
  process: function(src) {
    'use strict';
    return ReactTools.transform(src);
  }
};