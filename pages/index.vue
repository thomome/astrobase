<template>
	<main class="main-content">
		<ab-hero
			:title="title"
			:tagline="tagline"
			:description="description"
			:action="action"
		>
			<ab-picture
				:annotations="image.annotations"
				:image="image"
				:annotated="false"
				sizes="max(100vw, 100vh)"
			/>
		</ab-hero>
		<div class="picture-list container md:mt-24 mt-12">
			<h2 class="md:text-4xl text-2xl text-gray-200 tracking-wide font-semibold md:mb-4 mb-2">
				Recent Pictures
			</h2>
			<ab-masonry-grid :pictures="pictures" />

			<div class="flex justify-center pt-8 md:pb-24 pb-8">
				<nuxt-link
					to="/pictures"
					class="button"
				>
					Show all
				</nuxt-link>
			</div>
		</div>
	</main>
</template>

<script>
import { getPage, getPictures } from '~/api/api.js'

import AbHero from '~/components/AbHero.vue'
import AbMasonryGrid from '~/components/AbMasonryGrid.vue'
import AbPicture from '~/components/AbPicture.vue'

export default {
	components: { AbHero, AbPicture, AbMasonryGrid },
	async asyncData ({ params }) {
		const page = await getPage('home')
		const pictures = await getPictures({
			limit: 12
		})

		const { title, tagline, description, hero_image: image, action } = page.result

		const meta = {
			title: `${title}${tagline ? ' | ' + tagline : ''}`,
			meta: [
				{ hid: 'description', name: 'description', content: description || '' },
				{ property: 'og:type', content: 'website' },
				{ property: 'og:title', content: `${title}` },
				{ property: 'og:image', content: `${image.sizes.small}` },
				{ property: 'og:image:width', content: `${image.sizes['small-width']}` },
				{ property: 'og:image:height', content: `${image.sizes['small-height']}` }
			]
		}

		return {
			meta,
			title,
			tagline,
			description,
			action,
			image,
			pictures: pictures.results
		}
	},
	head () {
		return this.meta
	}
}
</script>

<style>

</style>
