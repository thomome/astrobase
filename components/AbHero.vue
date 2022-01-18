<template>
	<div class="hero relative flex">
		<div class="hero__image w-full h-full">
			<slot />
		</div>
		<div v-if="title || description || action" class="hero__content absolute m-4 md:m-8 mb-8 bottom-0 max-w-xl">
			<h1 class="md:text-6xl text-4xl text-gray-200 font-semibold leading-none">
				{{ title }}
			</h1>
			<div v-if="tagline" class="md:text-3xl text-xl text-gray-200 font-light italic">
				{{ tagline }}
			</div>
			<p class="text-gray-400 font-light md:text-lg md:mt-3 mt-2 md:mb-4 mb-3">
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
		tagline: { type: String, default: '' },
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

		&::after {
			position: absolute;
			display: block;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			background: linear-gradient(30deg, #00000099 10%, #00000011 60%), linear-gradient(15deg, #00000099 10%, #00000011 60%);
			content: '';
		}
	}

	.hero__content {
		left: 0;
		bottom: 0;

		@screen md {
			left: max(0px, calc(20% - 300px));
			bottom: max(0px, calc(15% - 100px));
		}
	}
</style>
