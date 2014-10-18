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

function commentValue(syntax, text) {
	return formatNode(syntax, getType(syntax.types, commentType), {value: text});
}

function formatNode(syntax, type, node) {
	var result = type.format;
	var comment = '';
	if (node.hasOwnProperty('comment')){
		// Get comment before node
		comment = commentValue(syntax, node.comment)
	}
	Object.keys(node).forEach(function(key) {
		result = result.replace('{' + key + '}', node[key]);
	});
	if (node.hasOwnProperty('disabled')) {
		return comment + commentValue(syntax, result);
	}
	return comment + newLine(result);
}

function processNode(syntax, node, nodeType) {
	var type;
	if (typeof syntax.types == 'undefined') {
		throw new Error('Not types are defined in syntax');
	}
	type = getType(syntax.types, nodeType);
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
	if (!config.data) {
		throw new Error ('Invalid config file, missing "data" section')
	}
	config.data.forEach(function(node) {
		buffer += processNode(syntax, node, node.type);
	});
	return buffer;
}

exports.generate = generate;

