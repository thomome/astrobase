<template>
	<svg
		:class="['icon', name]"
	>
		<use
			v-bind="{'xlink:href' : link}"
		/>
	</svg>
</template>

<script setup lang="ts">
interface Props {
	name: string;
}

const props = defineProps<Props>();

const link = computed(() => {
	return `/symbol-defs.svg#icon-${props.name}`
});
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
