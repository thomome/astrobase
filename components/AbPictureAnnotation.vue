<template>
	<g
		:transform="`translate(${x}, ${y})`"
		@click="showObjectTooltip"
		class="picture-annotation cursor-pointer"
	>
		<circle
			v-if="type === 'object'"
			:r="radius"
			:fill-opacity="opacity"
			class="picture-annotation__circle"
		/>
		<g
			v-if="type === 'star'"
			class="picture-annotation__crosshair"
		>
			<line x1="5" y1="0" x2="15" y2="0" />
			<line x1="-5" y1="0" x2="-15" y2="0" />
			<line x1="0" y1="5" x2="0" y2="15" />
			<line x1="0" y1="-5" x2="0" y2="-15" />
			<rect x="-15" y="-15" width="30" height="30" />
		</g>
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
		minRadius: { type: Number, default: 15 },
		padding: { type: Object, default: () => { return { x: 0, y: 0 } } }
	},
	computed: {
		x () { return this.annotation.pixelx * this.aspectRatio },
		y () { return this.annotation.pixely * this.aspectRatio },
		radius () { return this.annotation.radius > this.minRadius ? this.annotation.radius * this.aspectRatio : this.minRadius * this.aspectRatio },
		type () { return typeof (this.annotation.radius) === 'undefined' ? 'star' : 'object' },
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

	.picture-annotation__circle {
		fill: rgba(0,0,0,0);
		stroke: theme('colors.yellow.400');
		stroke-width: 1;
		transition: stroke .3s, stroke-width .3s, fill .3s;
	}

	.picture-annotation__crosshair {
		rect {
			fill: rgba(0,0,0,0);
			transition: stroke .3s, stroke-width .3s, fill .3s;
		}

		line {
			stroke: theme('colors.yellow.400');
			stroke-width: 1;
			transition: stroke .3s, stroke-width .3s, fill .3s;
		}
	}

	.picture-annotation__text {
		fill: theme('colors.yellow.400');
		transition: fill .15s;
		font-weight: 350;
		font-size: 0.875rem;
		text-shadow: 1px 1px 3px theme('colors.black');
	}

	.picture-annotation:hover {
		.picture-annotation__circle {
			stroke: theme('colors.white');
			stroke-width: 2;
			fill: rgba(0,0,0,0);
		}

		.picture-annotation__crosshair {
			line {
				stroke: theme('colors.white');
				stroke-width: 2;
			}
			rect {
				fill: rgba(0,0,0,0);
			}
		}

		.picture-annotation__text {
			fill: theme('colors.white');
		}
	}
</style>
