<template>
	<span
		:style="{ background: color }"
		class="tag rounded-sm text-black align-text-top ml-1"
	>
		{{ label }}
	</span>
</template>

<script>
export default {
	props: {
		type: { type: String, default: 'color' },
		label: { type: String, default: '' }
	},
	data () {
		return {
			colors: {
				'color': '#ffffff',
				'red': '#ff3515',
				'green': '#19ff35',
				'blue': '#0072ff',
				'h-alpha': '#ec5245',
				'h-beta': '#51fefe',
				'o-three': '#36e4b0',
				's-two': '#ffe018',
				'n-two': '#ec5247'
			}
		}
	},
	computed: {
		color () {
			return this.colors[this.type] || '#ffffff'
		}
	}
}
</script>

<style lang="scss" scoped>
	.tag {
		padding: 2px 6px;
	}

	.sm {
		@apply text-xs;
		padding: 1px 3px;
	}
</style>
