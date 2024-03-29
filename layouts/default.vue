<template>
	<div>
		<header
			ref="header"
			class="fixed main-header top-0 w-full pt-4 md:pt-12 pb-24 md:pt-12 z-20 pointer-events-none"
			:style="{ transform: `translateY(${navPos}px)` }"
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

let prevScrollY = 0
let positionRaw = 500

export default {
	components: { AbMainNavigation, AbMainFooter, AbTooltip },
	data () {
		return {
			navPos: 0,
			lastSize: [0, 0]
		}
	},
	mounted () {
		this.onResize()
		window.addEventListener('scroll', this.onScroll)
		window.addEventListener('resize', this.onResize)
	},
	destroyed () {
		window.removeEventListener('scroll', this.onScroll)
		window.removeEventListener('resize', this.onResize)
	},
	methods: {
		onResize () {
			const { lastSize } = this
			if (Math.abs(window.innerHeight - lastSize[1]) > 80) {
				const vh = window.innerHeight * 0.01
				document.documentElement.style.setProperty('--vh', `${vh}px`)
				this.lastSize = [window.innerWidth, window.innerHeight]
			}
		},
		onScroll () {
			const diff = prevScrollY - scrollY
			positionRaw = Math.min(Math.max(-300, positionRaw + diff), 300)

			this.navPos = Math.min(Math.max(positionRaw, -200), 0)

			prevScrollY = scrollY
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

	.page-enter-active,
	.page-leave-active {
		transition: opacity 0.25s, transform 0.25s;
	}
	.page-enter,
	.page-leave-to {
		opacity: 0;
		transform: translateY(-10px);
	}

	.container {
		@apply max-w-none mx-auto px-4;

		@screen md {
			@apply px-8;
		}

		@screen lg {
			@apply max-w-narrow;
		}

		&.container--wide {
			@screen lg {
				@apply max-w-narrow-plus;
			}
		}

		&.container--narrow {
			@screen lg {
				@apply max-w-tight;
			}
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
		@apply inline-block relative border border-yellow-400 px-7 py-2 text-yellow-400 text-sm tracking-wider uppercase font-medium outline-none overflow-hidden;
		transition: background-position .4s .1s, transform .2s, color .2s .1s;
		background: linear-gradient(70deg, theme('colors.yellow.400') 0%, theme('colors.yellow.400') 50%, transparent 50%, transparent 100%);
		background-size: 250%;
		background-position: 100% 0;

		&:hover {
			@apply text-black;
			background-position: 0 0;
			transform: scale(1.02);
		}

		&:active {
			transition: all .1s;
			transform: scale(0.98);
		}

		&.sm {
			@apply px-3 py-1 text-xs font-normal;
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
		@apply block text-gray-600 tracking-widest uppercase font-normal mb-1;
		font-size: 0.8rem;
	}
</style>
