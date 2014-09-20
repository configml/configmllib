'use strict';

var config = {
	data: [
	{
		type: 'execute',
		value: 'pathogen#infect()'
	}, {
		type: 'set',
		name: 't_Co',
		value: 256,
	}, {
		type: 'switch',
		name: 'syntax',
		value: 'on'
	}, {
		type: 'switch',
		name: 'colorscheme',
		value: 'haelequin'
	}, {
		type: 'set',
		name: 'tabstop',
		value: 4,
	}, {
		type: 'set',
		name: 'langmap',
		value: 'ъy,оo,пp,дd,гg,ГG,аa,АA,мm'
	}, {
		type: 'map',
		name: '<F2>',
		value: ':NERDTreeToggle<CR>'
	}, {
		type: 'let',
		name: 'g:airline_left_sep',
		value: '\'\''
	}, {
		type: 'let',
		name: 'g:airline_right_sep',
		value: '\'\''
	}, {
		type: 'switch',
		name: 'autocmd',
		value: 'Filetype php setlocal ts=4 sts=4 sw=4 expandtab'
	}, {
		type: 'switch',
		name: 'autocmd', 
		value: 'Filetype yaml setlocal ts=2 sts=2 sw=2'
	}
	]
};

var template = {
	types: {
		set: {
			f: '{type} {name}={value}'
		},
		execute: {
			f: '{type} {value}'
		},
		'switch': {
			f: '{name} {value}'
		},
		map: {
			f: '{type} {name} {value}'
		},
		'let': {
			ref: 'set'
		}
	}
};

function load(templateJson) {
	return JSON.parse(templateJson);
}

function generate(templateJson, configJson) {
	var template = load(templateJson);
	var config = load(configJson);
	return processConfig(template, config);
}

function formatNode(type, node) {
	var t =  type.f;
	Object.keys(node).forEach(function(key) {
		t = t.replace('{' + key + '}', node[key]);
	});
	return t+"\n";
}

function processNode(template, node, nodeType) {
	var t = template.types[nodeType];
	if (t) {
		if (t.f) {
			return formatNode(t, node);
		} else if (t.ref) {
			return processNode(template, node, t.ref); 
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

var r = generate(JSON.stringify(template), JSON.stringify(config));
console.log(r);
