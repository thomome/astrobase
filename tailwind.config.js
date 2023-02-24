/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
	theme: {
		fontFamily: {
			sans: ['Poppins', 'sans-serif'],
			display: ['Poppins', 'sans-serif'],
			body: ['Poppins', 'sans-serif']
		},
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		},
		extend: {
			maxWidth: {
				'wide': 'min(100%, 2200px)',
				'narrow': 'min(calc(100% - 100px), 2000px)',
				'narrow-plus': 'min(calc(100% - 50px), 2150px)',
				'tight': '54rem',
				'tight-plus': '68rem'
			},
			spacing: {
				n8: '-2rem'
			},
			fontWeight: {
				'medium': 450
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
	content: [
		'components/**/*.vue',
		'layouts/**/*.vue',
		'pages/**/*.vue',
		'plugins/**/*.ts',
		'nuxt.config.ts'
	],
	variants: {},
	plugins: []
}
