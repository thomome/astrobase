<template>
	<footer class="main-footer container flex justify-between px-8 pt-32 pb-8 pointer-events-auto">
		<div>
			<nuxt-link to="/imprint">
				Imprint
			</nuxt-link>
			<br>
			<a class="text-xs" target="_blank" rel="noopener" href="https://thomasguthruf.ch">© Thomas Guthruf</a>
		</div>
		<div class="flex">
			<a aria-label="Stellarium" target="_blank" rel="noopener" href="https://stellarium.org/" class="pl-4">
				<img src="/stellarium-logo.png" alt="Stellarium Logo" class="h-8">
			</a>
			<a aria-label="Astrometry.net" target="_blank" rel="noopener" href="http://astrometry.net/" class="pl-4">
				<img src="/astrometry-net-logo.png" alt="Astrometry.net Logo" class="h-8">
			</a>
		</div>
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
