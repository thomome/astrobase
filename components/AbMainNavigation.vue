<template>
	<nav
		:class="'main-navigation items-center flex max-w-wide mx-auto px-4 md:px-8 pointer-events-auto' + (isOpen ? ' main-navigation--open' : '')"
	>
		<nuxt-link
			:to="home.route"
			:exact="home.exact"
			class="main-navigation__link block border-gray-800 pointer-events-all"
		>
			{{ home.title }}
		</nuxt-link>
		<div
			class="main-navigation__container fixed md:static flex flex-col md:flex-row items-center justify-center md:justify-start top-0 left-0 w-full bg-gray-900 md:bg-transparent p-4 md:p-0"
		>
			<nuxt-link
				:to="home.route"
				:exact="home.exact"
				class="main-navigation__link block border-transparent pointer-events-all md:hidden"
				@click.native="isOpen = !isOpen"
			>
				{{ home.title }}
			</nuxt-link>
			<nuxt-link
				v-for="link in links"
				:key="link.id"
				:to="link.route"
				:exact="link.exact"
				class="main-navigation__link block border-transparent pointer-events-all"
				@click.native="isOpen = !isOpen"
			>
				{{ link.title }}
			</nuxt-link>
		</div>
		<button
			class="ml-auto md:hidden"
			aria-label="Navigation"
			@click="isOpen = !isOpen"
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
				// {
				// 	id: 3,
				// 	title: 'Blog',
				// 	route: '/posts'
				// },
				{
					id: 4,
					title: 'Tools',
					route: '/tools'
				},
				{
					id: 5,
					title: 'About',
					route: '/about'
				}
			]
		}
	}
}
</script>

<style lang="scss" scoped>
	.main-navigation__link {
		@apply border uppercase tracking-wider font-medium leading-tight text-sm text-gray-400 px-4 py-2;

		@screen md {
			@apply mr-8;
		}
	}

	.nuxt-link-active {
		@apply border-yellow-400 text-yellow-400;
	}

	.main-navigation__container {
		opacity: 0;
		visibility: hidden;
		height: 100vh;
		transform: translateX(100%);
		transition: transform .3s, opacity 0s .3s, visibility 0s .3s;

		.main-navigation__link {
			@apply mb-4;
		}

		@screen md {
			opacity: 1;
			visibility: visible;
			height: auto;
			transform: translateX(0);
			transition: none;

			.main-navigation__link {
				@apply mb-0;
			}
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
