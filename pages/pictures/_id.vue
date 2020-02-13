<template>
	<main class="main-content">
		<div class="container mt-32">
			<ab-picture
				:controls="true"
				:annotations="picture.annotations"
				:image="picture.image"
			/>
			<div class="picture__details mt-4">
				<div class="picture__column-container flex">
					<div class="picture__column picture__general max-w-xl">
						<h2 class="picture__title text-xl text-white">
							{{ picture.title }}
						</h2>

						<div class="picture__date-location text-gray-700 text-sm">
							{{ picture.date }} - {{ picture.location[0].title }}
						</div>

						<p class="picture__description max-w-6xl font-light leading-snug my-4">
							{{ picture.description }}
						</p>
						<div class="picture__tags max-w-6xl font-light text-sm">
							<nuxt-link
								v-for="tag in picture.tags"
								:key="tag.id"
								:to="{ path: 'pictures', query: { objects: [tag.id] } }"
								class="inline-block mr-2 border-b border-yellow-400 text-gray-300 hover:text-white"
							>
								{{ tag.name }}
							</nuxt-link>
						</div>
					</div>
					<div
						v-if="picture.exposures.length"
						class="picture__column picture__exposures ml-auto mr-16"
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

					<div
						v-if="picture.equipment.length"
						class="picture__column picture__equipment mr-16"
					>
						<h3 class="picture__details-title text-gray-700 text-sm uppercase font-medium mt-6 mb-2">
							Equipment
						</h3>
						<ul class="picture__details-list border-l border-yellow-400 pl-4 my-2 ml-1">
							<li
								v-for="device in picture.equipment"
								:key="device.id"
							>
								{{ device.title }}
							</li>
						</ul>
					</div>

					<div
						v-if="picture.process.length"
						class="picture__column picture__process"
					>
						<h3 class="picture__details-title text-gray-700 text-sm uppercase font-medium mt-6 mb-2">
							Process
						</h3>
						<ul class="picture__details-list border-l border-yellow-400 pl-4 my-2 ml-1">
							<li
								v-for="step in picture.process"
								:key="step.sofware"
							>
								{{ step.software }}
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
import moment from 'moment'

import { getPicture } from '~/api/api.js'

import AbPicture from '~/components/AbPicture.vue'
import AbTag from '~/components/AbTag.vue'

export default {
	components: { AbPicture, AbTag },
	computed: {
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
	},
	async asyncData ({ params }) {
		const picture = await getPicture(params.id)

		return {
			picture: picture.result
		}
	}
}
</script>

<style>

</style>
