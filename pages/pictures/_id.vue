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
							v-if="picture.description"
							v-html="picture.description"
							class="picture__description html-content max-w-6xl font-light leading-snug mt-6 mb-16"
						/>
						<div v-if="picture.stats">
							<ab-chart-comparison
								:data="data"
							/>
						</div>
					</div>
				</div>

				<div class="picture__column md:col-span-1">
					<div
						v-if="picture.exposures.length"
						class="picture__column picture__exposures mr-16"
					>
						<h3 class="picture__details-title section-title">
							Exposure Time
						</h3>
						<ul class="picture__details-list border-l border-yellow-400 pl-4 my-2 ml-1">
							<li
								v-for="exposure in picture.exposures"
								:key="exposure.exposure_time + exposure.mode"
							>
								{{ exposure.amount }} × {{ exposure.exposure_time }}&#8239;<small>s</small>
								<ab-tag
									v-if="exposure.gain"
									:label="exposure.gain"
									class="sm outline"
								/>
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
						class="picture__column picture__calibration mr-16"
					>
						<h3 class="picture__details-title section-title">
							Calibration
						</h3>

						<ab-skymap
							v-if="frame"
							:ra="frame.ra"
							:dec="frame.dec"
							:lat="location.coords.lat"
							:lon="location.coords.lng"
							:width="frame.w"
							:height="frame.h"
							:time="frame.t"
							:orientation="frame.o"
							class="mt-2"
						/>
						<table
							v-if="frame"
							class="text-xs mt-2"
						>
							<tbody>
								<tr>
									<td class="pr-4 pb-1 align-top font-medium">
										Center (RA, DEC)
									</td>
									<td class="pb-1 align-top">
										{{ frame.ra.toFixed(4) }}, {{ frame.dec.toFixed(4) }}
									</td>
								</tr>
								<tr>
									<td class="pr-4 pb-1 align-top font-medium">
										Size
									</td>
									<td class="pb-1 align-top">
										{{ frame.w.toFixed(3) }} × {{ frame.h.toFixed(3) }}&#8239;deg
									</td>
								</tr>
								<tr>
									<td class="pr-4 pb-1 align-top font-medium">
										Radius
									</td>
									<td class="pb-1 align-top">
										{{ frame.radius.toFixed(3) }}&#8239;deg
									</td>
								</tr>
								<tr v-if="conditions.moonDist">
									<td class="pr-4 pb-1 align-top font-medium">
										Avg. Distance to Moon
									</td>
									<td class="pb-1 align-top">
										{{ (conditions.moonDist / Math.PI * 180).toFixed(2) * 1 }}&#8239;deg
									</td>
								</tr>
							</tbody>
						</table>
						<div v-if="conditions.moonIllum && conditions.moonPosAngle" class="flex my-4">
							<ab-icon-moon
								:illuminated="conditions.moonIllum"
								:positionAngle="conditions.moonPosAngle"
								class="w-10 h-10"
							/>
							<div class="text-xs ml-4">
								<div>Avg. Moon phase<br><strong>{{ (conditions.moonIllum * 100).toFixed(2) * 1 }}&#8239;%</strong></div>
							</div>
						</div>
					</div>

					<div
						v-if="picture.objects.length"
						class="picture__tags max-w-6xl font-light text-sm"
					>
						<h3 class="picture__details-title section-title">
							Objects in picture
						</h3>
						<div>
							<nuxt-link
								v-for="obj in picture.objects"
								:key="obj.id"
								:to="{ path: '/pictures', query: { objects: [obj.id] } }"
								class="inline-block mr-2 border-b border-yellow-400 text-gray-300 hover:text-white"
							>
								{{ obj.name }}
							</nuxt-link>
						</div>
					</div>

					<div
						v-if="picture.equipment.length"
						class="picture__column picture__equipment mr-16 font-light text-sm"
					>
						<h3 class="picture__details-title section-title">
							Equipment
						</h3>
						<div>
							<nuxt-link
								v-for="device in picture.equipment"
								:key="device.id"
								:to="{ path: '/pictures', query: { devices: [device.id] } }"
								class="inline-block mr-2 border-b border-yellow-400 text-gray-300 hover:text-white"
							>
								{{ device.title }}
							</nuxt-link>
						</div>
					</div>

					<div
						v-if="picture.software.length"
						class="picture__column picture__software"
					>
						<h3 class="picture__details-title section-title">
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
import { getPicture } from '~/api/api.js'
import meeus from '~/assets/meeusjs/index.js'

import AbPicture from '~/components/AbPicture.vue'
import AbSkymap from '~/components/AbSkymap.vue'
import AbTag from '~/components/AbTag.vue'
import AbIcon from '~/components/AbIcon.vue'
import AbChartComparison from '~/components/AbChartComparison.vue'
import AbIconMoon from '~/components/AbIconMoon.vue'

export default {
	components: { AbPicture, AbSkymap, AbTag, AbIcon, AbChartComparison, AbIconMoon },
	data () {
		return {
			version: 0,
			statisticalData: []
		}
	},
	computed: {
		data () {
			const { statisticalData, location, frame } = this

			let data = [ ...statisticalData ]

			data.sort((a, b) => {
				return a.time === b.time ? 0 : a - b
			})

			if (data.length > 0) {
				let obs = null
				let obj = null
				if (location) {
					obs = meeus.EclCoord.fromWgs84(location.coords.lat, location.coords.lng, location.elevation)
				}
				if (frame) {
					obj = new meeus.EqCoord(frame.ra / 180 * Math.PI, frame.dec / 180 * Math.PI)
				}

				data = data.map((row, index) => {
					const newRow = { ...row }

					if (obs) {
						// Calculate moon altitude
						const date = new Date(row.time * 1000)
						const jdo = new meeus.JulianDay(date)
						const moonPos = meeus.Moon.topocentricPosition(jdo, obs, true)
						newRow.moonAlt = (moonPos.hz.alt / Math.PI * 180).toFixed(2) * 1
						if (obj) {
							// Calculate object altitude
							const sidereal = meeus.Sidereal.apparentInRa(jdo)
							const objPos = meeus.Coord.eqToHz(obj, obs, sidereal)
							newRow.objAlt = (objPos.alt / Math.PI * 180).toFixed(2) * 1

							// Calculate distance between object and moon
							const a = 	Math.sin(moonPos.hz.alt) * Math.sin(objPos.alt) +
										Math.cos(moonPos.hz.alt) * Math.cos(objPos.alt) * Math.cos(moonPos.hz.az - objPos.az)
							const c = Math.acos(a)
							newRow.moonDist = c
						}

						// Calculate Moon illumination
						const sunPos = meeus.Solar.apparentTopocentric(jdo, obs)
						const phaseAngle = meeus.MoonIllum.phaseAngleEq2(moonPos.eq, sunPos)
						const positionAngle = meeus.MoonIllum.positionAngle(moonPos.eq, sunPos)
						const illuminated = meeus.MoonIllum.illuminated(phaseAngle)
						newRow.moonIllum = illuminated
						newRow.moonPosAngle = positionAngle
					}

					// Calculate FWHM in arcseconds
					if (row.scale && row.fwhm) {
						newRow.fwhmArc = (row.scale * row.fwhm).toFixed(2)
						delete newRow.fwhm
					}

					delete newRow.time

					for (const key in newRow) {
						newRow[key] = parseFloat(newRow[key])
					}

					return {
						index,
						timestamp: parseInt(row.time),
						values: newRow
					}
				})
			}

			return data
		},
		conditions () {
			const { data, location, picture, frame } = this

			const conditions = {}

			if (data.length > 0) {
				const sums = {}
				const keys = [ 'moonIllum', 'moonDist', 'moonPosAngle' ]

				data.forEach(({ values }) => {
					keys.forEach((k) => {
						if (values[k] !== 'undefined') {
							if (typeof sums[k] === 'undefined') {
								sums[k] = 0
							}

							sums[k] += values[k]
						}
					})
				})
				for (const [key, value] of Object.entries(sums)) {
					conditions[key] = value / data.length
				}
			} else if (location) {
				const date = new Date(picture.timestamp)
				const jdo = new meeus.JulianDay(date)
				const obs = meeus.EclCoord.fromWgs84(location.coords.lat, location.coords.lng, location.elevation)
				const moonPos = meeus.Moon.topocentricPosition(jdo, obs, true)
				const sunPos = meeus.Solar.apparentTopocentric(jdo, obs)
				const phaseAngle = meeus.MoonIllum.phaseAngleEq2(moonPos.eq, sunPos)
				conditions.moonPosAngle = meeus.MoonIllum.positionAngle(moonPos.eq, sunPos)
				conditions.moonIllum = meeus.MoonIllum.illuminated(phaseAngle)

				if (frame) {
					const obj = new meeus.EqCoord(frame.ra / 180 * Math.PI, frame.dec / 180 * Math.PI)
					const sidereal = meeus.Sidereal.apparentInRa(jdo)
					const objPos = meeus.Coord.eqToHz(obj, obs, sidereal)
					const a = 	Math.sin(moonPos.hz.alt) * Math.sin(objPos.alt) +
								Math.cos(moonPos.hz.alt) * Math.cos(objPos.alt) * Math.cos(moonPos.hz.az - objPos.az)
					conditions.moonDist = Math.acos(a)
				}
			}
			return conditions
		},
		image () {
			const { picture, version } = this
			return picture.image[version] || null
		},
		frame () {
			const { image, picture } = this
			const { timestamp } = picture
			let { calibration, sizes } = image

			if (!calibration) {
				picture.image.some((img) => {
					if (img.calibration) {
						calibration = img.calibration
						sizes = img.sizes
						return true
					}
					return false
				})
			}

			return calibration ? {
				ra: calibration.ra,
				dec: calibration.dec,
				radius: calibration.radius,
				w: sizes['large-width'] * calibration.pixscale / 3600,
				h: sizes['large-height'] * calibration.pixscale / 3600,
				t: timestamp,
				o: calibration.parity === 1 ? calibration.orientation : calibration.orientation + 180
			} : null
		},
		location () {
			const { location } = this.picture
			return location[0] || null
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
		const { title, excerpt, image } = picture.result

		const meta = {
			title: `${title} - ${app.head.title}`,
			meta: [
				{ property: 'og:type', content: 'website' },
				{ property: 'og:title', content: `${title}` },
				{ property: 'og:description', content: `${excerpt}` },
				{ property: 'og:image', content: `${image[0].sizes.small}` },
				{ property: 'og:image:width', content: `${image[0].sizes['small-width']}` },
				{ property: 'og:image:height', content: `${image[0].sizes['small-height']}` }
			]
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
