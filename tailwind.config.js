/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
	theme: {
		fontFamily: {
			sans: ['Roboto', 'sans-serif'],
			display: ['Roboto', 'sans-serif'],
			body: ['Roboto', 'sans-serif'],
		},
		extend: {
			maxWidth: {
				'wide': '80rem',
				'narrow': '70rem',
				'narrow-plus': '74rem'
			},
			spacing: {
				n8: '-2rem',
			},
			colors: {
				yellow: {
					'100': '#FFFFF0',
					'200': '#FEFCBF',
					'300': '#FAF089',
					'400': '#FFD500',
					'500': '#ECC94B',
					'600': '#D69E2E',
					'700': '#B7791F',
					'800': '#975A16',
					'900': '#744210'
				},
				gray: {
					'100': '#f5f5f5',
					'200': '#eeeeee',
					'300': '#e0e0e0',
					'400': '#bdbdbd',
					'500': '#9e9e9e',
					'600': '#757575',
					'700': '#616161',
					'800': '#424242',
					'900': '#191919'
				}
			  }
		}
	},
	purge: {
		enabled: process.env.NODE_ENV === 'production',
		content: [
		  'components/**/*.vue',
		  'layouts/**/*.vue',
		  'pages/**/*.vue',
		  'plugins/**/*.js',
		  'nuxt.config.js'
		]
	},
	variants: {},
	plugins: []
}
