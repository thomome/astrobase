<template>
	<div class="hero relative flex">
		<div class="hero__image w-full h-full">
			<slot />
		</div>
		<div v-if="title || description || action" class="hero__content relative md:absolute p-6 pt-8 bottom-0 md:m-6 lg:mb-16 max-w-xl border-l-2 border-yellow-400 bg-gray-900">
			<h1 class="text-3xl text-gray-200 font-normal mb-4 tracking-wide leading-none">
				{{ title }}
			</h1>
			<p class="text-gray-400 font-light leading-relaxed mb-4">
				{{ description }}
			</p>
			<nuxt-link
				v-if="typeof action === 'object'"
				:to="action.url"
				class="button button--outline"
			>
				{{ action.title }}
			</nuxt-link>
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

<style lang="scss" scoped>
	.hero {
		@apply relative flex-col;
		height: calc(var(--vh, 1vh) * 100);

		&.hero--half {
			height: calc(var(--vh, 1vh) * 50);
		}
	}

	.hero__image {
		height: 100%;

		@media screen and (min-width: theme('screens.md')) {
			height: 100%;
		}
	}

	.hero__content {
		left: calc( ( 100vw - theme('maxWidth.wide') ) / 2);

		@media screen and (max-width: theme('maxWidth.wide')) {
			left: 0;
		}
	}
</style>
