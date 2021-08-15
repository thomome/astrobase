<template>
	<div ref="grid" class="ab-masonry-grid">
		<slot />
	</div>
</template>

<script>
export default {
	props: {
	},
	data () {
		return {
			gridGap: 10
		}
	},
	computed: {}
}
</script>

<style lang="scss" scoped>
	.ab-masonry-grid {
		display: flex;
		flex-wrap: wrap;
		margin-left: -5px;
		margin-right: -5px;

		&::after {
			content: '';
			flex-grow: 1000000000;
		}
	}

	.picture {
		margin: 5px;
		height: 300px;
		flex-grow: 1;
	}
</style>
