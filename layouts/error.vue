<template>
	<main class="main-content">
		<div class="container container--wide mt-16 md:mt-32">
			<nuxt-link
				to="/"
				class="inline-block mb-6 mt-5 text-gray-400 hover:text-white"
			>
				<ab-icon
					name="arrow-left"
					class="text-2xl align-top"
				/>
				<span>Back to Home</span>
			</nuxt-link>
		</div>
		<div class="container mt-4">
			<h1
				v-if="error.statusCode === 404"
				class="picture__title text-2xl leading-tight text-gray-200 mb-1 font-light"
			>
				404 - Page not found
			</h1>
			<h1 v-else>
				An error occurred
			</h1>
		</div>
	</main>
</template>

<script>
import AbIcon from '~/components/AbIcon.vue'

export default {
	components: { AbIcon },
	props: {
		error: { type: Object, required: true }
	},
	layout: 'error'
}
</script>
