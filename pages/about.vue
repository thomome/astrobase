<template>
	<main class="main-content">
		<ab-hero
			:title="title"
		>
			<ab-image
				:image="picture"
				class="w-full h-full object-cover"
			/>
		</ab-hero>
		<client-only>
			<ab-map
				:locations="locations"
			/>
		</client-only>
	</main>
</template>

<script>
import { getPage } from '~/api/api.js'

import AbHero from '~/components/AbHero.vue'
import AbImage from '~/components/AbImage.vue'
import AbMap from '~/components/AbMap.vue'

export default {
	components: { AbHero, AbImage, AbMap },
	async asyncData ({ params }) {
		const page = await getPage('about')

		return {
			title: page.result.title,
			picture: page.result.hero_image,
			locations: page.result.current_locations
		}
	}
}
</script>

<style>

</style>
