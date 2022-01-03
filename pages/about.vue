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
		<div v-for="equipment in equipments" :key="equipment.title" class="equipment container my-16">
			<h2 class="text-2xl text-gray-200 tracking-wide font-normal mb-4">
				{{ equipment.title }}
			</h2>
			<div class="devices">
				<div
					v-for="device in equipment.devices"
					:key="device.id"
					:title="device.title"
					class="device relative flex flex-col px-4 pt-4 pb-8"
				>
					<div class="card__image flex items-center h-48 mb-4">
						<ab-image
							v-if="!Array.isArray(device.image)"
							:image="device.image"
							sizes="290px"
							class="w-full h-full object-contain"
						/>
					</div>
					<div class="card__content my-auto mx-4 text-center">
						<div class="section-title mt-2">
							{{ device.brand }}
						</div>
						<h3 class="text-gray-200 tracking-wide font-normal">
							{{ device.title }}
						</h3>
					</div>
				</div>
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
import AbMap from '~/components/AbMap.vue'

export default {
	components: { AbHero, AbImage, AbMap },
	async asyncData ({ params, app }) {
		const page = await getPage('about')

		const { title, description, hero_image: picture, equipments, current_locations: locations } = page.result

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
			equipments,
			locations
		}
	},
	head () {
		return this.meta
	}
}
</script>

<style lang="scss" scoped>
	.devices {
		display: grid;
		gap: 2rem;
		grid-auto-flow: row dense;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	}

	.device {
		background: #ffffff08;
		border-radius: 10px;
	}
</style>
