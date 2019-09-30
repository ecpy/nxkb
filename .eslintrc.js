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
		'global-require': 0,
		'import/no-unresolved': 0,
		semi: [2, 'never'],
		indent: [2],
		'symbol-description': 0,
	},
}
