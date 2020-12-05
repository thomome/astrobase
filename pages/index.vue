<template>
	<main class="main-content">
		<ab-hero
			:title="title"
			:description="description"
			:action="action"
		>
			<ab-picture
				:annotations="image.annotations"
				:image="image"
				:annotated="true"
			/>
		</ab-hero>
		<div class="picture-list container mt-24">
			<h2 class="text-2xl text-gray-200 tracking-wide font-normal mb-4">
				Most Recent Pictures
			</h2>
			<ab-post-picture
				v-for="picture in pictures"
				:key="picture.id"
				:picture="picture"
			/>

			<div class="flex justify-center pt-2 pb-24">
				<nuxt-link
					to="/pictures"
					class="button"
				>
					Show all Pictures
				</nuxt-link>
			</div>
		</div>
	</main>
</template>

<script>
import { getPage, getPictures } from '~/api/api.js'

import AbHero from '~/components/AbHero.vue'
import AbPicture from '~/components/AbPicture.vue'
import AbPostPicture from '~/components/AbPostPicture.vue'

export default {
	components: { AbHero, AbPicture, AbPostPicture },
	async asyncData ({ params }) {
		const page = await getPage('home')
		const pictures = await getPictures({
			limit: 3
		})

		const { title, description, hero_image: image, action } = page.result

		const meta = {
			title,
			meta: [
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
