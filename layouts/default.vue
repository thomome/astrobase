<template>
	<div>
		<header
			:class="'fixed main-header top-0 w-full pt-4 lg:pt-12 pb-24 lg:pt-12 z-20 pointer-events-none' + (isScrolled ? ' main-header--scrolled' : '')"
		>
			<ab-main-navigation />
		</header>
		<nuxt />
		<ab-main-footer />
	</div>
</template>

<script>
import AbMainNavigation from '~/components/AbMainNavigation.vue'
import AbMainFooter from '~/components/AbMainFooter.vue'

export default {
	components: { AbMainNavigation, AbMainFooter },
	data () {
		return {
			isScrolled: false,
			lastSize: [0, 0]
		}
	},
	mounted () {
		this.setVh()
		window.addEventListener('scroll', this.onScroll)
		window.addEventListener('resize', this.setVh)
	},
	destroyed () {
		window.removeEventListener('scroll', this.onScroll)
		window.removeEventListener('resize', this.setVh)
	},
	methods: {
		setVh () {
			const { lastSize } = this
			if (Math.abs(window.innerHeight - lastSize[1]) > 80) {
				const vh = window.innerHeight * 0.01
				document.documentElement.style.setProperty('--vh', `${vh}px`)
				this.lastSize = [window.innerWidth, window.innerHeight]
			}
		},
		onScroll () {
			if (pageYOffset > 40) {
				this.isScrolled = true
			} else {
				this.isScrolled = false
			}
		}
	}
}
</script>

<style lang="scss">
	body {
		@apply bg-gray-900 text-gray-400;
	}

	.main-header {
		background-image: linear-gradient(#000000ff 0%, #00000022 80%, #00000011 90%, #00000006 95%, #00000000 100%);
	}

	.container {
		@apply max-w-narrow mx-auto px-4;

		&.container--wide {
			@apply max-w-narrow-plus;
		}

		@media screen and (min-width: theme('screens.lg')) {
			@apply px-8;
		}
	}

	.button {
		@apply inline-block border border-gray-400 px-4 py-2 text-gray-400 font-light outline-none;
	}

	button {
		@apply outline-none;

		&:focus {
			@apply outline-none;
		}
	}

	.video-container {
		@apply relative h-0 w-full;
		padding-bottom: 56.25%;

		iframe {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}

	.html-content {
		a {
			background-image: linear-gradient(120deg, theme('colors.yellow.400') 0%, theme('colors.yellow.400') 100%);
			background-repeat: no-repeat;
			background-size: 100% 1px;
			background-position: 0 95%;
			transition: all 0.1s ease-in;

			&:hover {
				background-size: 100% 88%;
				@apply text-black;
			}
		}
	}

	.section-title {
		@apply text-xs inline-block text-gray-600 tracking-widest uppercase font-medium mt-6 mb-1;
	}
</style>
