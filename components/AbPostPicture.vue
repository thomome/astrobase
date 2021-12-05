<template>
	<div class="picture relative mb-12 block lg:flex">
		<div class="picture__image-container w-full">
			<nuxt-link
				:to="`/pictures/${picture.id}`"
				:aria-label="picture.title"
			>
				<ab-image
					:image="image"
					class="picture__image w-full"
				/>
			</nuxt-link>
		</div>
		<div class="picture__details flex-shrink-0 xl:w-1/4 lg:w-1/3 lg:ml-8">
			<h2 class="picture__title md:text-3xl text-2xl leading-tight font-light text-gray-200 mt-4 lg:mt-0">
				<nuxt-link
					:to="`/pictures/${picture.id}`"
				>
					{{ picture.title }}
				</nuxt-link>
			</h2>

			<div class="picture__date-location text-gray-700 text-sm leading-relaxed">
				{{ picture.date }} <span v-if="picture.location[0]"> - {{ picture.location[0].title }}</span>
			</div>

			<div class="picture__column-container hidden md:flex flex-wrap lg:block">
				<ab-object-list :objects="picture.objects" :number="3" title="Objects in Frame" />
			</div>

			<div class="picture__column-container hidden md:flex flex-wrap lg:block">
				<ab-exposure-time :exposures="picture.exposures" :compact="true" title="Exposures" />
			</div>
		</div>
	</div>
</template>

<script>
import AbObjectList from './ImageDetail/AbObjectList.vue'
import AbExposureTime from './ImageDetail/AbExposureTime.vue'
import AbImage from '~/components/AbImage.vue'

export default {
	components: { AbImage, AbObjectList, AbExposureTime },
	props: {
		picture: { type: Object, required: true }
	},
	computed: {
		image () {
			return this.picture.image[0]
		}
	}
}
</script>
