'use strict';

var syntaxConfig = {};
var commentType = '_comment';

function generate(syntax, config) {
	syntaxConfig = syntax.config;
	return processConfig(syntax, config);
}

function newLine(text) {
	return text + syntaxConfig.eol;
}

function getType(types, typeName) {
	if (types.hasOwnProperty(typeName)) {
		return types[typeName];
	}
	throw new Error('"' + typeName + '" type not found');
}

function formatNode(syntax, type, node) {
	var result = type.format;
	if (node.hasOwnProperty('comment')){
		// Add comment before node
		var comment = formatNode(syntax, getType(syntax.types, commentType), {value: node.comment})
		result = comment + result;
	}
	Object.keys(node).forEach(function(key) {
		result = result.replace('{' + key + '}', node[key]);
	});
	return newLine(result);
}

function processNode(syntax, node, nodeType) {
	var type = getType(syntax.types, nodeType);
	if (type.hasOwnProperty('format')) {
		return formatNode(syntax, type, node);
	} else if (type.ref) {
		return processNode(syntax, node, type.ref);
	} else {
		throw new Error('"' + node.type + '" missing format string');
	}
}

function processConfig(syntax, config) {
	var buffer = '';
	config.data.forEach(function(node) {
		buffer += processNode(syntax, node, node.type);
	});
	return buffer;
}

exports.generate = generate;

