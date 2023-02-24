<template>
	<div class="block-slider">
		<h3 v-if="title" class="block-slider__title section-title">
			{{ title }}
		</h3>
		<div class="block-slider__container mt-3">
			<div v-for="item in items" :key="item.id">
				<slot name="item" :item="item">
					{{ item.id }}
				</slot>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
export interface Props {
  title?: string
  items?: any[];
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  items: () => [] 
})

</script>

<style lang="scss" scoped>
	.block-slider__container {
		@apply grid gap-3;
		grid-auto-flow: row dense;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	}
</style>
