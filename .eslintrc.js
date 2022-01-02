module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	parserOptions: {
		parser: '@babel/eslint-parser',
		requireConfigFile: false
	},
	extends: [
		'@nuxtjs',
		'plugin:nuxt/recommended'
	],
	// add your custom rules here
	rules: {
		'indent': ['error', 'tab'],
		'no-tabs': 0,
		'quote-props': 'off',
		'multiline-ternary': 'off',
		'vue/html-indent': ['error', 'tab'],
		'vue/no-v-html': 'off'
	}
}
