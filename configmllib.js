'use strict';

var templateConfig = {};

function generate(template, config) {
	templateConfig = template.config;
	return processConfig(template, config);
}

function newLine(text) {
	return text + templateConfig.eol;
}

function formatNode(type, node) {
	var result = type.format;
	Object.keys(node).forEach(function(key) {
		result = result.replace('{' + key + '}', node[key]);
	});
	return newLine(result);
}

function processSpecialNode(template, node) {
	var handlers = {
		'_nl': function () {
			return newLine('');
		},
		'_comment': function () {
			var comment = template.config.comment;
			return newLine(comment.prefix + node.value + comment.suffix);
		}
	};
	if (handlers.hasOwnProperty(node.type)) {
		return handlers[node.type](template, node);
	}
	throw new Error('Special handler "' + node.type + '" is not defined');
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
	} else if (nodeType[0] === '_') {
		return processSpecialNode(template, node);
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

exports.generate = generate;

