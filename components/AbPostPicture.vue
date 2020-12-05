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
			<h2 class="picture__title text-xl leading-tight font-medium text-gray-200 mt-4 lg:mt-0">
				<nuxt-link
					:to="`/pictures/${picture.id}`"
				>
					{{ picture.title }}
				</nuxt-link>
			</h2>

			<div class="picture__date-location text-gray-700 text-sm">
				{{ picture.date }} - {{ picture.location[0].title }}
			</div>

			<nuxt-link
				:to="`/pictures/${picture.id}`"
			>
				<p
					v-html="picture.excerpt"
					class="picture__description max-w-md lg:max-w-6xl font-light leading-snug my-4"
				/>
			</nuxt-link>

			<div class="picture__column-container hidden md:flex flex-wrap lg:block">
				<ab-object-list :objects="picture.objects" :showAll="false" title="Objects in Picture" />
			</div>

			<div class="picture__column-container hidden md:flex flex-wrap lg:block">
				<ab-exposure-time :exposures="picture.exposures" title="Exposure Time" />
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
