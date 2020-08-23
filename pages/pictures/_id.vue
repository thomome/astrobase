<template>
	<main class="main-content">
		<div class="container container--wide mt-16 md:mt-32">
			<nuxt-link
				to="/pictures"
				class="inline-block mb-6 mt-5 text-gray-300 hover:text-white"
			>
				<ab-icon
					name="arrow-left"
					class="text-2xl align-top"
				/>
				<span>Back to Pictures</span>
			</nuxt-link>
		</div>
		<div class="container mt-4">
			<div class="picture__column picture__general max-w-xl mb-4">
				<h1 class="picture__title text-2xl leading-tight text-white">
					{{ picture.title }}
				</h1>

				<div class="picture__date-location text-gray-700 text-sm">
					{{ picture.date }} - {{ location.title }}
				</div>
			</div>
			<div class="picture__image">
				<ab-picture
					:controls="true"
					:image="image"
				/>
			</div>

			<div class="picture__details md:flex my-4">
				<div class="picture__column max-w-2xl">
					<div class="picture__image-description text-gray-700 text-sm leading-tight border-l border-yellow-400 pl-3 mb-4">
						{{ image.description }}
					</div>
				</div>
				<div class="picture__column ml-auto">
					<div
						v-if="picture.image.length > 1"
						class="picture__versions flex"
					>
						<button
							v-for="(img, index) in picture.image"
							:key="img.id"
							@click="version = index"
							:class="'picture__version-item ml-2 w-16 border border-solid ' + (index === version ? 'border-yellow-400' : 'border-transparent')"
						>
							<img
								:src="img.sizes.thumbnail"
							>
						</button>
					</div>
				</div>
			</div>

			<div class="picture__details md:grid md:grid-cols-3 md:gap-12">
				<div class="picture__column md:col-span-2">
					<div class="picture__general">
						<div
							v-html="picture.description"
							class="picture__description html-content max-w-6xl font-light leading-snug my-6"
						/>
						<div v-if="picture.stats">
							<ab-chart-comparison
								:statisticalData="statisticalData"
							/>
						</div>
					</div>
				</div>

				<div class="picture__column md:col-span-1">
					<div
						v-if="picture.exposures.length"
						class="picture__column picture__exposures mr-16"
					>
						<h3 class="picture__details-title text-gray-700 text-sm uppercase font-medium mt-6 mb-2">
							Exposure Time
						</h3>
						<ul class="picture__details-list border-l border-yellow-400 pl-4 my-2 ml-1">
							<li
								v-for="exposure in picture.exposures"
								:key="exposure.exposure_time + exposure.mode"
							>
								{{ exposure.amount }} × {{ exposure.exposure_time }}&#8239;<small>s</small>
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

					<ab-skymap
						v-if="image.calibration"
						:ra="frame.ra"
						:dec="frame.dec"
						:lat="location.coords.lat"
						:lon="location.coords.lng"
						:width="frame.w"
						:height="frame.h"
						:time="frame.t"
						:orientation="frame.o"
						class="mt-8"
					/>
					<table
						v-if="image.calibration"
						class="text-xs mt-2"
					>
						<tbody>
							<tr>
								<td class="pr-4 font-medium">
									Center (RA, DEC)
								</td>
								<td>
									{{ frame.ra.toFixed(4) }}, {{ frame.dec.toFixed(4) }}
								</td>
							</tr>
							<tr>
								<td class="pr-4 font-medium">
									Size
								</td>
								<td>
									{{ frame.w.toFixed(3) }} × {{ frame.h.toFixed(3) }} deg
								</td>
							</tr>
							<tr>
								<td class="pr-4 font-medium">
									Radius
								</td>
								<td>
									{{ image.calibration.radius.toFixed(3) }} deg
								</td>
							</tr>
						</tbody>
					</table>

					<div
						v-if="picture.objects.length"
						class="picture__tags max-w-6xl font-light text-sm"
					>
						<h3 class="picture__details-title text-gray-700 text-sm uppercase font-medium mt-6 mb-2">
							Objects in picture
						</h3>
						<nuxt-link
							v-for="obj in picture.objects"
							:key="obj.id"
							:to="{ path: '/pictures', query: { objects: [obj.id] } }"
							class="inline-block mr-2 border-b border-yellow-400 text-gray-300 hover:text-white"
						>
							{{ obj.name }}
						</nuxt-link>
					</div>

					<div
						v-if="picture.equipment.length"
						class="picture__column picture__equipment mr-16 font-light text-sm"
					>
						<h3 class="picture__details-title text-gray-700 text-sm uppercase font-medium mt-6 mb-2">
							Equipment
						</h3>
						<nuxt-link
							v-for="device in picture.equipment"
							:key="device.id"
							:to="{ path: '/pictures', query: { devices: [device.id] } }"
							class="inline-block mr-2 border-b border-yellow-400 text-gray-300 hover:text-white"
						>
							{{ device.title }}
						</nuxt-link>
					</div>

					<div
						v-if="picture.software.length"
						class="picture__column picture__software"
					>
						<h3 class="picture__details-title text-gray-700 text-sm uppercase font-medium mt-6 mb-2">
							Software
						</h3>
						<ul class="picture__details-list border-l border-yellow-400 pl-4 my-2 ml-1">
							<li
								v-for="software in picture.software"
								:key="software.id"
							>
								{{ software.title }}
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
import Papa from 'papaparse'
import { julian, moonillum, sunrise } from 'astronomia'

import { getPicture } from '~/api/api.js'

import AbPicture from '~/components/AbPicture.vue'
import AbSkymap from '~/components/AbSkymap.vue'
import AbTag from '~/components/AbTag.vue'
import AbIcon from '~/components/AbIcon.vue'
import AbChartComparison from '~/components/AbChartComparison.vue'

export default {
	components: { AbPicture, AbSkymap, AbTag, AbIcon, AbChartComparison },
	data () {
		return {
			version: 0,
			statisticalData: []
		}
	},
	computed: {
		image () {
			const { picture, version } = this
			return picture.image[version]
		},
		frame () {
			const { sizes, calibration } = this.image
			const { timestamp } = this.picture

			return {
				ra: calibration.ra,
				dec: calibration.dec,
				w: sizes['large-width'] * calibration.pixscale / 3600,
				h: sizes['large-height'] * calibration.pixscale / 3600,
				t: timestamp,
				o: calibration.parity === 1 ? calibration.orientation : calibration.orientation + 180
			}
		},
		location () {
			return this.picture.location[0]
		},
		moonphase () {
			const date = new Date(this.picture.timestamp)
			const jd = new julian.Calendar().fromDate(date)
			const sun = new sunrise.Sunrise(jd, this.location.coords.lat, this.location.coords.lng)
			const jde = jd.toJDE()
			return {
				test: Math.round((1 - Math.abs(moonillum.phaseAngle3(jde) / Math.PI)) * 100) + '%',
				test2: sun
			}
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
	},
	async asyncData ({ params, app }) {
		const picture = await getPicture(params.id)
		const meta = {
			title: `${picture.result.title} - ${app.head.title}`
		}

		return {
			meta,
			picture: picture.result
		}
	},
	head () {
		return this.meta
	},
	mounted () {
		if (this.picture.stats) {
			Papa.parse(this.picture.stats, {
				download: true,
				header: true,
				complete: (result, file) => {
					this.statisticalData = result.data
				}
			})
		}
	}
}
</script>

<style lang="scss">
	.picture__description {
		p {
			@apply my-6;
		}
	}
</style>
