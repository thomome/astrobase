<template>
	<main class="main-content">
		<div class="container container--wide mt-16 md:mt-32">
			<nuxt-link
				to="/posts"
				class="inline-block mb-6 mt-5 text-gray-400 hover:text-white"
			>
				<ab-icon
					name="arrow-left"
					class="text-2xl align-top"
				/>
				<span>Back to Articles</span>
			</nuxt-link>
		</div>
		<div class="container container--narrow mt-4">
			<div class="post__column post__general mb-4">
				<h1 class="post__title text-2xl leading-tight text-gray-200 mb-1 font-light">
					{{ post.title }}
				</h1>

				<div class="post__date-author text-gray-700 text-sm">
					{{ post.date }} - {{ post.author }}
				</div>

				<div
					v-html="post.content"
					class="post__content html-content font-light"
				/>
			</div>
		</div>
	</main>
</template>

<script>
import { getPost } from '~/api/api.js'
import AbIcon from '~/components/AbIcon.vue'

export default {
	components: { AbIcon },
	data () {
		return {}
	},
	computed: {
		timestamp () {
			const { timestamp } = this.picture
			return timestamp
		}
	},
	async asyncData ({ params, app }) {
		const post = await getPost(params.slug)
		const { title, excerpt, image } = post.result

		const meta = {
			title: `${title} - ${app.head.title}`,
			meta: [
				{ property: 'og:type', content: 'website' },
				{ property: 'og:title', content: `${title}` },
				{ property: 'og:description', content: `${excerpt}` },
				{ property: 'og:image', content: `${image.sizes.small}` },
				{ property: 'og:image:width', content: `${image.sizes['small-width']}` },
				{ property: 'og:image:height', content: `${image.sizes['small-height']}` }
			]
		}

		return {
			meta,
			post: post.result
		}
	},
	head () {
		return this.meta
	}
}
</script>

<style lang="scss">
</style>
