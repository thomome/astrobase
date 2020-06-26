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
			<h2 class="text-2xl text-white mb-4">
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

		return {
			title: page.result.title,
			description: page.result.description,
			action: page.result.action,
			image: page.result.hero_image,
			pictures: pictures.results
		}
	},
	head () {
		return {
			title: this.title
		}
	}
}
</script>

<style>

</style>
