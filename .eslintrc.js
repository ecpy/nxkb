module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	extends: ['airbnb-base'],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	rules: {
		camelcase: 0,
		'import/newline-after-import': 0,
		'global-require': 0,
		'import/no-unresolved': 0,
		'class-methods-use-this': 0,
		'no-tabs': 0,
		'indent': ['tab'],
		semi: [2, 'never'],
		indent: ["error", 2],
		'symbol-description': 0,
	},
}
