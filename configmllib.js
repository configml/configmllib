'use strict';

var config = require('./syntax/vim/tests/01/config.json');
var template = require('./syntax/vim/syntax.json');


var templateConfig = {};

function load(templateJson) {
	return JSON.parse(templateJson);
}

function generate(templateJson, configJson) {
	var template = load(templateJson);
	var config = load(configJson);
	templateConfig = template.config;
	return processConfig(template, config);
}

function formatNode(type, node) {
	var result = type.format;
	Object.keys(node).forEach(function(key) {
		result = result.replace('{' + key + '}', node[key]);
	});
	return result + templateConfig.eol;
}

function processNode(template, node, nodeType) {
	var t = template.types[nodeType];
	if (t) {
		if (t.format) {
			return formatNode(t, node);
		} else if (t.ref) {
			return processNode(template, node, t.ref); 
		} else {
			throw new Error('"' + node.type + '" missing format string');
		}
	} else {
		throw new Error('"' + node.type + '" type not found');
	}
}

function processConfig(template, config) {
	var buffer = '';
	config.data.forEach(function(node) {
		buffer += processNode(template, node, node.type);
	});
	return buffer;
}

var result = generate(JSON.stringify(template), JSON.stringify(config));

console.log(result);
