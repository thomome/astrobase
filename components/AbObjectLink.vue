<template>
	<span
		@click="showObjectTooltip"
		class="object-link"
	>
		{{ obj.name }}
	</span>
</template>

<script>
import { EventBus } from '~/plugins/EventBus'

export default {
	props: {
		obj: { type: Object, required: true }
	},
	methods: {
		showObjectTooltip (event) {
			const { obj } = this

			const target = event.currentTarget
			const trigger = target
			const links = [
				{
					url: { path: '/pictures', query: { objects: [obj.id] } },
					text: `Search by "${obj.name}"`
				},
				{
					external: true,
					url: `https://www.astrobin.com/search/?q=${obj.name}`,
					text: 'Astrobin'
				},
				{
					external: true,
					url: `http://simbad.u-strasbg.fr/simbad/sim-basic?Ident=${obj.name}`,
					text: 'Simbad'
				},
				{
					external: true,
					url: `https://nasasearch.nasa.gov/search/images?affiliate=nasa&cr=true&query=${obj.name}`,
					text: 'NASA'
				}
			]

			EventBus.$emit('show-tooltip', {
				target,
				trigger,
				links
			})
		}
	}
}
</script>
