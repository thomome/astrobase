<template>
	<span
		:style="style"
		class="tag"
	>
		{{ label }}
	</span>
</template>

<script>
export default {
	props: {
		type: { type: String, default: '' },
		label: { type: String, default: '' }
	},
	data () {
		return {
			colors: {
				'color': '#ffffff',
				'red': '#ff3515',
				'green': '#19ff35',
				'blue': '#0072ff',
				'dual-band': 'linear-gradient(110deg, #ec5245 40%, #36e4b0 70%)',
				'h-alpha': '#ec5245',
				'h-beta': '#51fefe',
				'o-three': '#36e4b0',
				's-two': '#ffe018',
				'n-two': '#ec5247'
			}
		}
	},
	computed: {
		style () {
			const { type, color } = this
			return type ? { background: color } : {}
		},
		color () {
			return this.colors[this.type] || '#ffffff'
		}
	}
}
</script>

<style lang="scss" scoped>
	.tag {
		@apply inline-block leading-none rounded-sm text-black mr-1 text-center;
		padding: 3px 6px 2px;
		min-width: 16px;
	}

	.sm {
		@apply text-xs leading-none;
		padding: 3px 4px 2px;
	}

	.outline {
		@apply border-solid border-gray-300 border text-gray-300;
		padding: 2px 3px 1px;
	}
</style>
