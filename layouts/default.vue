<template>
	<div>
		<header
			:class="'fixed main-header top-0 w-full pt-4 lg:pt-12 pb-24 lg:pt-12 z-20 pointer-events-none' + (isScrolled ? ' main-header--scrolled' : '')"
		>
			<ab-main-navigation />
		</header>
		<nuxt />
		<ab-main-footer />
		<ab-tooltip />
	</div>
</template>

<script>
import AbMainNavigation from '~/components/AbMainNavigation.vue'
import AbMainFooter from '~/components/AbMainFooter.vue'
import AbTooltip from '~/components/AbTooltip.vue'

export default {
	components: { AbMainNavigation, AbMainFooter, AbTooltip },
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

		&.container--narrow {
			@apply max-w-tight;
		}

		@media screen and (min-width: theme('screens.lg')) {
			@apply px-8;
		}
	}

	label {
		@apply block text-sm;

		span {
			@apply block;
		}
	}

	input,
	select {
		@apply px-2 py-1 text-sm;
		background: #ffffff19;
		outline: none;
	}

	select {
		@apply cursor-pointer;
	}

	input[type="checkbox"] {
		@apply cursor-pointer;
	}

	input[type="number"] {
		text-align: right;
		width: 75px;
		-moz-appearance: textfield;

		&::-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
	}

	.button {
		@apply inline-block border border-gray-500 px-4 py-2 text-gray-500 text-sm font-normal outline-none;
		transition: all .3s;

		&:hover {
			@apply border-gray-400 text-gray-300;
			background: #ffffff19;
		}

		&:active {
			transform: scale(0.98);
		}

		&.sm {
			@apply px-3 py-1 text-xs;
		}

	}

	button {
		@apply outline-none;

		&:focus {
			@apply outline-none;
		}
	}

	.object-link {
		@apply inline-block leading-tight mr-2 mb-1 border-b border-yellow-400 text-gray-300 cursor-pointer;

		&:hover {
			@apply text-white;
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
		h2 {
			@apply text-xl font-normal mt-6 mb-1 text-gray-300;
		}

		h3 {
			@apply text-lg font-normal mt-5 mb-1 text-gray-300;
		}

		p {
			@apply mb-4;
		}

		a {
			background-image: linear-gradient(120deg, theme('colors.yellow.400') 0%, theme('colors.yellow.400') 100%);
			background-repeat: no-repeat;
			background-size: 100% 0.5px;
			background-position: 0 95%;
			transition: all 0.1s ease-in;

			&:hover {
				@apply text-white;
				background-size: 100% 1px;
			}
		}

		ul {
			@apply ml-6;
			list-style-type: square;
		}

		ol {
			@apply ml-6;
			list-style-type: decimal;
		}
	}

	.section-title {
		@apply text-xs block text-gray-600 tracking-widest uppercase font-normal mt-6 mb-1;
	}
</style>
