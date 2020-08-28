<template>
	<g>
		<path
			:d="path"
			:style="`stroke: ${color};`"
			class="ab-chart__plot-path"
		/>
		<circle
			v-for="point in serie"
			:key="point.x"
			:cx="point.x * width"
			:cy="point.y * height"
			:r="point.index === activeIndex ? 4 : 2"
			:style="`fill: ${color};`"
			class="ab-chart__plot-dot"
		/>
	</g>
</template>
<script>
export default {
	components: {},
	props: {
		serie: { type: Array, required: true },
		activeIndex: { type: Number, default: null },
		width: { type: Number, default: 10 },
		height: { type: Number, default: 10 },
		color: { type: String, default: '' }
	},
	data () {
		return {}
	},
	computed: {
		path () {
			const { serie, width, height } = this

			let pathString = ''
			serie.forEach((o, i) => {
				pathString += i === 0 ? 'M ' : 'L '
				pathString += `${o.x * width} ${o.y * height} `
			})
			return pathString
		}
	}
}
</script>
<style lang="scss" scoped>
	.ab-chart__plot-path {
		fill: none;
		stroke: theme('colors.yellow.400');
		stroke-width: 1;
	}

	.ab-chart__plot-dot {
		fill: theme('colors.yellow.400');
		stroke: none;
		transition: r 0.15s;
	}
</style>
