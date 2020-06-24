<template>
	<nuxt-link
		:to="link"
		:transform="`translate(${x}, ${y})`"
		:event="linkDisabled ? '' : 'click'"
		class="picture-annotation"
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
			<rect
				:width="labelW"
				:height="labelH"
				:transform="`translate(0, ${ ( labelH - padding.y ) * -0.5 })`"
				class="picture-annotation__background"
			/>
			<text
				ref="text"
				:transform="`translate(${ padding.x }, ${ padding.y })`"
				class="picture-annotation__text"
				dominant-baseline="middle"
			>
				{{ label }}
			</text>
		</g>
	</nuxt-link>
</template>

<script>
export default {
	props: {
		linkDisabled: { type: Boolean, default: false },
		annotation: { type: Object, required: true },
		ratio: { type: Number, default: 1 },
		minRadius: { type: Number, default: 30 },
		padding: { type: Object, default: () => { return { x: 0, y: 0 } } }
	},
	data () {
		return {
			labelW: 0,
			labelH: 0
		}
	},
	computed: {
		x () { return this.annotation.pixelx * this.ratio },
		y () { return this.annotation.pixely * this.ratio },
		radius () { return this.annotation.radius > this.minRadius ? this.annotation.radius * this.ratio : this.minRadius * this.ratio },
		opacity () { return 1 - this.radius / 1000 },
		label () { return this.annotation.name ? this.annotation.name : this.annotation.names.reduce((p, c) => p.length > c.length ? c : p) },
		labelX () { return Math.cos(Math.PI / 4) * this.radius - 10 },
		labelY () { return Math.sin(Math.PI / 4) * this.radius - 10 },
		link () {
			return {
				path: '/pictures',
				query: { objects: [this.annotation.object_id] }
			}
		}
	},
	mounted () {
		const textBBox = this.$refs.text.getBBox()
		if (textBBox.height !== 0) {
			this.labelW = textBBox.width + this.padding.x * 2
			this.labelH = textBBox.height + this.padding.y * 2
		}
	}
}
</script>

<style lang="scss">
	$white: #ffffff;

	.picture-annotation__outline {
		fill: transparentize($white, .86);
		stroke-dasharray: 6px 6px;
		stroke: theme('colors.gray.100');
		stroke-width: .4;
		transition: stroke .3s, fill .3s;
	}

	.picture-annotation__background {
		fill: theme('colors.gray.900');
		stroke: theme('colors.gray.100');
		stroke-width: .5;
		transition: stroke .15s;
	}

	.picture-annotation__text {
		fill: theme('colors.gray.400');
		transition: fill .15s;
		font-weight: 300;
	}

	.picture-annotation:hover {
		.picture-annotation__outline {
			stroke: theme('colors.white');
			fill: transparentize($white, .83);
		}

		.picture-annotation__background {
			stroke: theme('colors.white');
		}

		.picture-annotation__text {
			fill: theme('colors.white');
		}
	}
</style>
