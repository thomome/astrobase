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
	</main>
</template>

<script>
import { getPage } from '~/api/api.js'

import AbHero from '~/components/AbHero.vue'
import AbImage from '~/components/AbImage.vue'

export default {
	components: { AbHero, AbImage },
	async asyncData ({ params }) {
		const page = await getPage('about')

		return {
			title: page.title,
			picture: page.hero_image
		}
	}
}
</script>

<style>

</style>
