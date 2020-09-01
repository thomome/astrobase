<template>
	<nav
		:class="'main-navigation items-center flex max-w-wide mx-auto px-4 lg:px-8 pointer-events-auto' + (isOpen ? ' main-navigation--open' : '')"
	>
		<nuxt-link
			:to="home.route"
			:exact="home.exact"
			class="block border border-gray-800 px-4 py-2 mr-8 text-gray-400 leading-tight pointer-events-all"
		>
			{{ home.title }}
		</nuxt-link>
		<div
			class="main-navigation__container fixed md:static flex flex-col md:flex-row items-center justify-center md:justify-start top-0 left-0 w-full bg-gray-900 md:bg-transparent p-4 md:p-0"
		>
			<nuxt-link
				:to="home.route"
				:exact="home.exact"
				@click.native="isOpen = !isOpen"
				class="block border border-transparent px-4 py-2 md:mr-8 text-gray-400 leading-tight pointer-events-all mb-4 md:hidden"
			>
				{{ home.title }}
			</nuxt-link>
			<nuxt-link
				v-for="link in links"
				:key="link.id"
				:to="link.route"
				:exact="link.exact"
				@click.native="isOpen = !isOpen"
				class="block border border-transparent px-4 py-2 md:mr-8 text-gray-400 leading-tight pointer-events-all mb-4 md:mb-0"
			>
				{{ link.title }}
			</nuxt-link>
		</div>
		<button
			@click="isOpen = !isOpen"
			class="ml-auto md:hidden"
			aria-label="Navigation"
		>
			<ab-hamburger
				:active="isOpen"
			/>
		</button>
	</nav>
</template>

<script>
import AbHamburger from '~/components/AbHamburger.vue'

export default {
	components: { AbHamburger },
	data () {
		return {
			isOpen: false,
			home: {
				id: 1,
				title: 'Astrobase',
				route: '/',
				exact: true
			},
			links: [
				{
					id: 2,
					title: 'Pictures',
					route: '/pictures'
				},
				{
					id: 4,
					title: 'About',
					route: '/about'
				}
			]
		}
	}
}
</script>

<style lang="scss" scoped>
	.nuxt-link-active {
		@apply border-yellow-400 text-yellow-400;
	}

	.main-navigation__container {
		opacity: 0;
		visibility: hidden;
		height: calc(var(--vh, 1vh) * 100);
		transform: translateX(100%);
		transition: transform .3s, opacity 0s .3s, visibility 0s .3s;

		@media screen and (min-width: theme('screens.md')) {
			opacity: 1;
			visibility: visible;
			height: auto;
			transform: translateX(0);
			transition: none;
		}
	}

	.main-navigation--open {
		.main-navigation__container {
			opacity: 1;
			visibility: visible;
			transform: translateX(0);
			transition: transform .3s, opacity 0s, visibility 0s;
		}
	}
</style>
