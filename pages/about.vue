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
		<div class="equipment container mt-24">
			<h2 class="text-2xl text-white mb-4">
				Equipment
			</h2>
			<div class="devices grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
				<ab-card
					v-for="device in devices"
					:key="device.id"
					:title="device.title"
				>
					<ab-image
						v-if="!Array.isArray(device.image)"
						:image="device.image"
						class="w-full h-full object-contain"
					/>
				</ab-card>
			</div>
		</div>
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
import AbCard from '~/components/AbCard.vue'
import AbMap from '~/components/AbMap.vue'

export default {
	components: { AbHero, AbImage, AbCard, AbMap },
	async asyncData ({ params, app }) {
		const page = await getPage('about')

		const meta = {
			title: `${page.result.title} - ${app.head.title}`
		}

		return {
			meta,
			title: page.result.title,
			picture: page.result.hero_image,
			devices: page.result.current_equipment,
			locations: page.result.current_locations
		}
	},
	head () {
		return this.meta
	}
}
</script>

<style>

</style>
