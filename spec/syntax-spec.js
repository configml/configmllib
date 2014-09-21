var fs = require('fs');
var generate = require('../configmllib.js').generate;
var crypto = require('crypto');

function hash(text) {
	return crypto.createHash('md5').update(text).digest('hex');
}

describe('Check syntax', function() {
	it('validates syntax', function() {
		var test = './syntax/vim/tests/01/.vimrc';
		var config = require('../syntax/vim/tests/01/config.json');
		var template = require('../syntax/vim/syntax.json');

		var result = generate(template, config);
		var expected = fs.readFileSync(test, 'utf8');
		expect(result).toEqual(expected);
	});
});

