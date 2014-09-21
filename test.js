'use strict';

var cml = require('./configmllib');

var path = './' + process.argv[2];

var config = require(path + 'config.json');
var syntax = require(path + '../../syntax.json');

console.log(cml.generate(syntax, config))
