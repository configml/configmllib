var fs = require('fs');
var generate = require('../configmllib.js').generate;
var crypto = require('crypto');

function hash(text) {
	return crypto.createHash('md5').update(text).digest('hex');
}

describe('Check syntax', function() {
	it('validates syntax', function() {
		var testCases = [
			{
				config: '../syntax/vim/tests/01/config.json',
				template: '../syntax/vim/syntax.json',
				test: './syntax/vim/tests/01/.vimrc'
			},
			{
				config: '../syntax/editorconfig/tests/01/config.json',
				template: '../syntax/editorconfig/syntax.json',
				test: './syntax/editorconfig/tests/01/.editorconfig'
			}
		];

		testCases.forEach(function(testCase) {
			var config = require(testCase.config);
			var template = require(testCase.template);
			var expected = fs.readFileSync(testCase.test, 'utf8');
			var result = generate(template, config);
			expect(result).toEqual(expected);
		});
	});
});

