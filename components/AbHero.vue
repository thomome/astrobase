<template>
	<div class="hero relative h-screen">
		<div class="hero__image w-full h-full">
			<slot />
		</div>
		<div class="hero__content absolute p-6 bottom-0 m-6 mb-16 max-w-xl border-l-2 border-yellow-400 bg-gray-900">
			<h1 class="text-3xl text-white font-medium mb-4 leading-none">
				{{ title }}
			</h1>
			<p class="text-gray-400 font-light mb-4">
				{{ description }}
			</p>
			<a class="button button--outline" target="" href="http://astrobase.site/pictures">
				<span>Explore the Pictures</span>
			</a>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		title: { type: String, default: '' },
		description: { type: String, default: '' },
		action: { type: Object, default: () => {} }
	}
}
</script>

<style lang="scss">
	.hero__content {
		left: calc( ( 100vw - theme('maxWidth.wide') ) / 2);

		@media screen and (max-width: theme('maxWidth.wide')) {
			left: 0;
		}
	}
</style>