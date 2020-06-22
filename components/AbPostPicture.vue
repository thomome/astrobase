<template>
	<div class="picture relative mb-12 block lg:flex">
		<div class="picture__image-container">
			<nuxt-link
				:to="`/pictures/${picture.id}`"
				tag="a"
			>
				<ab-image
					:image="image"
					class="picture__image block w-full min-h-full object-cover"
				/>
			</nuxt-link>
		</div>
		<div class="picture__details flex-shrink-0 xl:w-1/4 lg:w-1/3 lg:ml-8">
			<h2 class="picture__title text-xl text-white mt-4 lg:mt-0">
				<nuxt-link
					:to="`/pictures/${picture.id}`"
					tag="a"
				>
					{{ picture.title }}
				</nuxt-link>
			</h2>

			<div class="picture__date-location text-gray-700 text-sm">
				{{ picture.date }} - {{ picture.location[0].title }}
			</div>

			<p class="picture__description max-w-md lg:max-w-6xl font-light leading-snug my-4">
				{{ picture.description }}
			</p>
			<div class="picture__tags max-w-sm lg:max-w-6xl font-light text-sm">
				<nuxt-link
					v-for="tag in picture.tags"
					:key="tag.id"
					:to="{ path: 'pictures', query: { objects: [tag.id] } }"
					class="inline-block mr-2 border-b border-yellow-400 text-gray-300 hover:text-white"
				>
					{{ tag.name }}
				</nuxt-link>
			</div>

			<div class="picture__column-container hidden md:flex flex-wrap lg:block">
				<div
					v-if="picture.exposures.length"
					class="picture__column picture__exposures mr-16 lg:mr-0"
				>
					<h3 class="picture__details-title text-gray-700 text-sm uppercase font-medium mt-6 mb-2">
						Exposure Time
					</h3>
					<ul class="picture__details-list border-l border-yellow-400 pl-4 my-2 ml-1">
						<li
							v-for="exposure in picture.exposures"
							:key="exposure.exposure_time + exposure.mode"
						>
							{{ exposure.amount }} x {{ exposure.exposure_time }}&#8239;<small>s</small>
							<ab-tag
								:label="exposure.mode.label"
								:type="exposure.mode.value"
								class="sm"
							/>
						</li>
					</ul>
					<div class="-ml-px">
						<span class="text-yellow-400 mr-2">∑</span>
						<span v-html="totalExposureTime" class="font-medium" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import moment from 'moment'

import AbImage from '~/components/AbImage.vue'
import AbTag from '~/components/AbTag.vue'

export default {
	components: { AbImage, AbTag },
	props: {
		picture: { type: Object, required: true }
	},
	computed: {
		image () {
			return this.picture.image[0]
		},
		totalExposureTime () {
			const secs = this.picture.exposures.reduce((p, v) => {
				return p + v.exposure_time * v.amount
			}, 0)

			const duration = moment.duration(secs * 1000)
			const hours = duration.hours()
			const minutes = duration.minutes()
			const seconds = duration.seconds()

			let durationString = ''
			if (hours) { durationString += `${hours}&#8239;<small>h</small> ` }
			if (minutes) { durationString += `${minutes}&#8239;<small>min</small> ` }
			if (seconds) { durationString += `${seconds}&#8239;<small>s</small>` }

			return durationString
		}
	}
}
</script>
