<template>
	<main class="main-content">
		<div class="picture-list container mt-24 md:mt-40">
			<h1 class="hidden">
				Blog
			</h1>

			<div
				v-for="post in posts"
				:key="post.id"
				class="post flex"
			>
				<div class="post__image-container w-full">
					<nuxt-link
						:to="`/posts/${post.slug}`"
						:aria-label="post.title"
					>
						<ab-image
							:image="post.image"
						/>
					</nuxt-link>
				</div>
				<div class="post__details flex-shrink-0 xl:w-2/4 lg:w-2/4 lg:ml-8">
					<nuxt-link
						:to="`/posts/${post.slug}`"
						:aria-label="post.title"
					>
						<h2 class="post__title text-xl leading-tight font-normal text-gray-200 mt-4 mb-1 lg:mt-0">
							{{ post.title }}
						</h2>
						<div class="post__date-author text-gray-700 text-sm">
							{{ post.date }} - {{ post.author }}
						</div>
						<p class="post__excerpt max-w-md lg:max-w-6xl font-light leading-snug mt-4">
							{{ post.excerpt }}
						</p>
					</nuxt-link>
					<nuxt-link
						:to="`/posts/${post.slug}`"
						:aria-label="post.title"
						class="object-link mt-4"
					>
						Read more
					</nuxt-link>
				</div>
			</div>

			<ab-loading
				v-if="isLoading"
				class="mx-auto mt-12 mb-24"
			/>
		</div>
	</main>
</template>

<script>
import { getPosts } from '~/api/api.js'
import AbImage from '~/components/AbImage.vue'

import AbLoading from '~/components/AbLoading.vue'

const config = {
	perPage: 6
}

export default {
	components: { AbLoading, AbImage },
	async asyncData ({ query, app }) {
		const params = {
			limit: config.perPage,
			offset: 0
		}

		const posts = await getPosts(params)

		const meta = {
			title: `Blog - ${app.head.title}`,
			meta: [
				{ property: 'og:type', content: 'website' },
				{ property: 'og:title', content: 'Blog' },
				{ property: 'og:description', content: 'Posts around the topic of astrophotography.' }
			]
		}

		return {
			meta,
			posts: posts.results,
			total: posts.total,
			isLoading: false,
			params
		}
	},
	data () {
		return {
			isLoading: true
		}
	},
	mounted () {
		window.addEventListener('scroll', () => {
			if (!this.isLoading && this.params.offset + config.perPage < this.total && this.getScrollPosition() > 0.6) {
				this.params.offset += config.perPage
				this.fetch()
			}
		})
	},
	methods: {
		async fetch () {
			this.isLoading = true
			const posts = await getPosts(this.params)
			this.posts.push(...posts.results)
			this.isLoading = false
		},
		getScrollPosition () {
			const h = document.documentElement
			const b = document.body
			const st = 'scrollTop'
			const sh = 'scrollHeight'
			return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)
		}
	},
	head () {
		return this.meta
	}
}
</script>

<style lang="scss" scoped>
</style>
