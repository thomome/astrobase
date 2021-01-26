import { getPictures } from "./api/api";

export default {
	server: {
		port: 8080, // default: 3000
		host: process.env.HOST ? process.env.HOST : '0.0.0.0' // default: localhost
	},
	/*
	** Headers of the page
	*/
	head: {
		title: 'Astrobase',
		htmlAttrs: {
			lang: 'en'
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=yes' },
			{ hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
		],
		link: [
			{ rel: 'icon', type: 'image/png', href: '/favicon.png' },
			{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Heebo:wght@100..900&display=swap' }
		]
	},
	/*
	** Customize the progress-bar color
	*/
	loading: { color: '#FFD500' },
	/*
	** Global CSS
	*/
	css: [
	],
	/*
	** Plugins to load before mounting the App
	*/
	plugins: [
		{ src: '~/plugins/mapbox', mode: 'client' }
	],
	/*
	** Nuxt.js dev-modules
	*/
	buildModules: [
		// Doc: https://github.com/nuxt-community/eslint-module
		'@nuxtjs/eslint-module',
		// Doc: https://github.com/nuxt-community/nuxt-tailwindcss
		'@nuxtjs/tailwindcss',
		'nuxt-purgecss',
	],
	/*
	** Nuxt.js modules
	*/
	modules: [
		// Doc: https://axios.nuxtjs.org/usage
		'@nuxtjs/axios',
		'@nuxtjs/sitemap',
		'nuxt-history-state'
	],

	historyState: {
        maxHistoryLength: 50, // or any positive integer
        reloadable: false, // or true
        overrideDefaultScrollBehavior: true, // or false
        scrollingElements: '#scroll' // or any selector
    },
	sitemap: async () => {
		const pictures = await getPictures({ limit: 50 })
		return {
			routes: pictures ? pictures.results.map((picture) => `/pictures/${picture.id}`) : []
		}
	},
	purgeCSS: {
		whitelistPatterns: [
			/^ct/,
			/multiselect/,
			/mapboxgl/,
			/mgl/
		]
	},
	/*
	** Axios module configuration
	** See https://axios.nuxtjs.org/options
	*/
	axios: {
	},
	/*
	** Build configuration
	*/
	build: {
		/*
		** You can extend webpack config here
		*/
		extractCSS: true,
	
		extend (config, ctx) {
			config.node = {
				fs: "empty"
			};
		}
	}
}
