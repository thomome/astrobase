<template>
	<main class="main-content">
		<ab-hero
			class="hero--half"
		>
			<ab-image
				:image="picture"
				class="w-full h-full object-cover"
			/>
		</ab-hero>
		<div class="container mt-8">
			<h1 class="text-3xl mb-4 text-white">
				{{ title }}
			</h1>
			<p class="html-content md:w-3/4" v-html="content" />
		</div>
	</main>
</template>

<script>
import { getPage } from '~/api/api.js'

import AbHero from '~/components/AbHero.vue'
import AbImage from '~/components/AbImage.vue'

export default {
	components: { AbHero, AbImage },
	async asyncData ({ params, app, error }) {
		try {
			const page = await getPage(params.path)

			const { title, hero_image: picture, content } = page.result

			const meta = {
				title: `${title} - ${app.head.title}`,
				meta: [
					{ property: 'og:type', content: 'website' },
					{ property: 'og:title', content: `${title}` },
					{ property: 'og:image', content: `${picture.sizes.small}` },
					{ property: 'og:image:width', content: `${picture.sizes['small-width']}` },
					{ property: 'og:image:height', content: `${picture.sizes['small-height']}` }
				]
			}

			return {
				meta,
				title,
				picture,
				content
			}
		} catch (err) {
			return error(err)
		}
	},
	head () {
		return this.meta
	}
}
</script>

<style>

</style>
