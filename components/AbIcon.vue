<template>
	<svg
		:class="['icon', name]"
	>
		<use
			v-bind="{'xlink:href' : link}"
		/>
	</svg>
</template>

<script>
export default {
	props: {
		name: { type: String, required: true }
	},
	computed: {
		link () {
			return `/symbol-defs.svg#icon-${this.name}`
		}
	}
}
</script>

<style scoped>
.icon {
	display: inline-block;
	width: 1em;
	height: 1em;
	stroke-width: 0;
	stroke: currentColor;
	fill: currentColor;
}
</style>
