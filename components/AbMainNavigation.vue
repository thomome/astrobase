<template>
	<nav class="main-navigation flex max-w-wide mx-auto px-8 pointer-events-auto">
		<nuxt-link
			v-for="link in links"
			:key="link.id"
			:to="link.route"
			:exact="link.exact"
			class="block border border-transparent px-4 py-2 mr-8 text-gray-400 leading-tight pointer-events-all"
		>
			{{ link.title }}
		</nuxt-link>
	</nav>
</template>

<script>
export default {
	data () {
		return {
			links: [
				{
					id: 1,
					title: 'Astrobase',
					route: '/',
					exact: true
				},
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
</style>
