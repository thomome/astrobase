<template>
	<footer class="main-footer container flex justify-between px-8 pt-32 pb-8 pointer-events-auto">
		<div>
			<nuxt-link to="/imprint">
				Imprint
			</nuxt-link>
			<br>
			<a class="text-xs" target="_blank" rel="noopener" href="https://thomasguthruf.ch">© Thomas Guthruf</a>
		</div>
		<a target="_blank" rel="noopener" href="http://astrometry.net/">
			<img src="/astrometry-net-logo.png" class="w-24">
		</a>
	</footer>
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
</style>
