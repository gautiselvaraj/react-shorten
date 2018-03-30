module.exports = require('babel-jest').createTransformer({
  presets: ['flow', 'react', 'env'],
  "plugins": [ "transform-class-properties" ]
});
