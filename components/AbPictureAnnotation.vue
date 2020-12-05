<template>
	<g
		:transform="`translate(${x}, ${y})`"
		@click="showObjectTooltip"
		class="picture-annotation cursor-pointer"
	>
		<circle
			:r="radius"
			:fill-opacity="opacity"
			class="picture-annotation__outline"
		/>
		<g
			:transform="`translate(${ labelX }, ${ labelY })`"
			class="picture-annotation__label"
		>
			<text
				ref="text"
				:transform="`translate(${ padding.x }, ${ padding.y })`"
				class="picture-annotation__text"
				dominant-baseline="middle"
			>
				{{ label }}
			</text>
		</g>
	</g>
</template>

<script>
import { EventBus } from '~/plugins/EventBus'

export default {
	props: {
		linkDisabled: { type: Boolean, default: false },
		annotation: { type: Object, required: true },
		aspectRatio: { type: Number, default: 1 },
		minRadius: { type: Number, default: 30 },
		padding: { type: Object, default: () => { return { x: 0, y: 0 } } }
	},
	computed: {
		x () { return this.annotation.pixelx * this.aspectRatio },
		y () { return this.annotation.pixely * this.aspectRatio },
		radius () { return this.annotation.radius > this.minRadius ? this.annotation.radius * this.aspectRatio : this.minRadius * this.aspectRatio },
		opacity () { return 1 - this.radius / 1000 },
		label () { return this.annotation.long_name },
		labelX () { return Math.cos(Math.PI / 4) * this.radius },
		labelY () { return Math.sin(Math.PI / 4) * this.radius },
		link () {
			return {
				path: '/pictures',
				query: { objects: [this.annotation.object_id] }
			}
		}
	},
	methods: {
		showObjectTooltip (event) {
			const { annotation, link, linkDisabled } = this

			if (linkDisabled) {
				return false
			}

			const target = this.$refs.text
			const trigger = event.currentTarget
			const links = [
				{
					url: link,
					text: `Search by "${annotation.name}"`
				},
				{
					external: true,
					url: `https://www.astrobin.com/search/?q=${annotation.name}`,
					text: 'Astrobin'
				},
				{
					external: true,
					url: `http://simbad.u-strasbg.fr/simbad/sim-basic?Ident=${annotation.name}`,
					text: 'Simbad'
				},
				{
					external: true,
					url: `https://nasasearch.nasa.gov/search/images?affiliate=nasa&cr=true&query=${annotation.name}`,
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

<style lang="scss">
	$white: #ffffff;

	.picture-annotation__outline {
		fill: rgba(0,0,0,0);
		stroke: theme('colors.yellow.400');
		stroke-width: 1;
		transition: stroke .3s, stroke-width .3s, fill .3s;
	}

	.picture-annotation__text {
		fill: theme('colors.yellow.400');
		transition: fill .15s;
		font-weight: 300;
		font-size: 0.875rem;
		text-shadow: 1px 1px 3px theme('colors.black');
	}

	.picture-annotation:hover {
		.picture-annotation__outline {
			stroke: theme('colors.white');
			stroke-width: 2;
			fill: rgba(0,0,0,0);
		}

		.picture-annotation__text {
			fill: theme('colors.white');
		}
	}
</style>
