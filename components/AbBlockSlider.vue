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

<script>
export default {
	props: {
		title: { type: String, default: '' },
		items: { type: Array, default: () => [] }
	}
}
</script>

<style lang="scss" scoped>
	.block-slider__container {
		@apply grid gap-3;
		grid-auto-flow: row dense;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	}
</style>
