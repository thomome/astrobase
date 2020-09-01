<template>
	<div class="card relative p-8">
		<div class="card__image flex items-center h-48">
			<slot />
		</div>
		<div class="card__content py-12 text-center">
			<h1 class=" text-white font-medium mb-4 leading-none">
				{{ title }}
			</h1>
			<p class="text-gray-400 font-light mb-4">
				{{ description }}
			</p>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		title: { type: String, default: '' },
		description: { type: String, default: '' }
	}
}
</script>

<style lang="scss">
	.card__image {
		opacity: 0.8;
	}
</style>
