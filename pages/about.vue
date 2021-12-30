<template>
	<main class="main-content">
		<ab-hero
			:title="title"
			:description="description"
		>
			<ab-image
				:image="picture"
				class="w-full h-full object-cover"
				sizes="max(100vw, 100vh)"
			/>
		</ab-hero>
		<div class="equipment container mt-24">
			<h2 class="text-2xl text-gray-200 tracking-wide font-normal mb-4">
				Current Equipment
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
						sizes="380px"
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

		const { title, description, hero_image: picture, current_equipment: devices, current_locations: locations } = page.result

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
			description,
			picture,
			devices,
			locations
		}
	},
	head () {
		return this.meta
	}
}
</script>

<style>

</style>
