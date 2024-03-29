import axios from 'axios'



export default {
	env: {
		apiEndpoint: process.env.API_ENDPOINT || 'http://localhost:8081/wp-json/astrobase'
	},
	publicRuntimeConfig: {
		umami: {
			scriptUrl: process.env.UMAMI_SCRIPT_URL,
			websiteId: process.env.UMAMI_WEBSITE_ID,
			domains: 'astrobase.ch',
			cache: true
		}
	},
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
		],
		link: [
			{ rel: 'icon', type: 'image/png', href: '/favicon.png' },
			{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap' }
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
		'~/plugins/ObserveVisibility.js',
		{ src: '~/plugins/Umami.js', ssr: false }
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,
	
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
		'@nuxtjs/sitemap'
	],
	sitemap: async () => {
		const url = process.env.API_ENDPOINT || 'http://localhost:8081/wp-json/astrobase'
		const q = await axios.get(`${url}/pictures`, {
			params: { limit: 50 }
		})
		const pictures = q.data;
		return {
			routes: pictures?.results ? pictures.results.map((picture) => `/pictures/${picture.id}`) : []
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
			config.module.rules.push({
				test: /\.worker\.js$/,
				use: { loader: "worker-loader" }
			});
		}
	}
}
