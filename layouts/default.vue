<template>
	<div>
		<header class="fixed main-header top-0 w-full pt-12 pb-24 z-20 pointer-events-none">
			<ab-main-navigation />
		</header>
		<nuxt />
	</div>
</template>

<script>
import AbMainNavigation from '~/components/AbMainNavigation.vue'

export default {
	components: { AbMainNavigation }
}
</script>

<style lang="scss">
	body {
		@apply bg-gray-900 text-gray-400;
	}

	.main-header {
		background-image: linear-gradient(#000000ff 0%, #00000022 80%, #00000011 90%, #00000006 95%, #00000000 100%);
	}

	.container {
		@apply max-w-narrow mx-auto px-8;
	}

	.button {
		@apply inline-block border border-gray-400 px-4 py-2 text-gray-400 font-light;
	}
</style>
