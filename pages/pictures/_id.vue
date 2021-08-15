<template>
	<main class="main-content">
		<div class="container container--wide mt-16 md:mt-32">
			<nuxt-link
				to="/pictures"
				class="inline-block mb-6 mt-5 text-gray-400 hover:text-white"
			>
				<ab-icon
					name="arrow-left"
					class="text-2xl align-top"
				/>
				<span>Back to Pictures</span>
			</nuxt-link>
		</div>
		<div class="container mt-4">
			<div class="picture-grid">

				<!-- Title and other meta informaton -->
				<div class="picture__column picture__title max-w-xl">
					<h1 class="picture__title text-2xl leading-tight text-gray-200 mb-1 font-light">
						{{ picture.title }}
					</h1>

					<div class="picture__date-location text-gray-700 text-sm">
						{{ picture.date }} <span v-if="location"> - {{ location.title }}</span>
					</div>
				</div>

				<!-- Image & description with navigation -->
				<div class="picture__image">
					<div class="flex flex-col relative">
						<ab-picture
							:controls="true"
							:image="image"
							max-height="80vh"
						/>
						<div class="picture__details md:flex my-4">
							<div class="picture__column max-w-2xl">
								<div class="picture__image-description text-gray-700 text-sm leading-tight border-l border-yellow-400 pl-3 mb-4">
									{{ image.date }}<span v-if="image.description"> - {{ image.description }}</span>
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
										:class="'picture__version-item ml-2 w-16 border border-solid ' + (index === version ? 'border-yellow-400' : 'border-transparent')"
										@click="version = index"
									>
										<img
											:src="img.sizes.thumbnail"
										>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Subframe graphs -->
				<div class="picture__graph" v-if="picture.stats">
					<ab-chart-comparison
						:data="data"
					/>
				</div>

				<!-- Picture text content -->
				<div
					v-if="picture.description"
					class="picture__content html-content max-w-6xl font-light leading-snug mt-6 mb-16"
					v-html="picture.description"
				/>

				<!-- Sidebar with meta information -->
				<div class="picture__sidebar">
					<ab-exposure-time
						:exposures="picture.exposures"
						title="Exposure Time"
					/>

					<ab-calibration
						v-if="location && data && frame"
						:data="data"
						:frame="frame"
						:timestamp="timestamp"
						:location="location"
						title="Calibration"
					/>

					<ab-guiding
						:guiding="picture.guiding || null"
						title="Guiding"
					/>

					<ab-object-list
						:objects="picture.objects"
						:show-all="true"
						title="Objects in picture"
					/>

					<ab-equipment-list
						:equipment="picture.equipment"
						title="Equipment"
					/>

					<ab-software-list
						:software="picture.software"
						title="Software"
					/>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
import Papa from 'papaparse'
import { getPicture } from '~/api/api.js'
import meeus from '~/assets/meeusjs/index.js'

import AbPicture from '~/components/AbPicture.vue'
import AbIcon from '~/components/AbIcon.vue'
import AbChartComparison from '~/components/Chart/AbChartComparison.vue'
import AbObjectList from '~/components/ImageDetail/AbObjectList.vue'
import AbExposureTime from '~/components/ImageDetail/AbExposureTime.vue'
import AbCalibration from '~/components/ImageDetail/AbCalibration.vue'
import AbEquipmentList from '~/components/ImageDetail/AbEquipmentList.vue'
import AbSoftwareList from '~/components/ImageDetail/AbSoftwareList.vue'
import AbGuiding from '~/components/ImageDetail/AbGuiding.vue'

export default {
	components: { AbPicture, AbIcon, AbChartComparison, AbObjectList, AbExposureTime, AbCalibration, AbEquipmentList, AbSoftwareList, AbGuiding },
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
	data () {
		return {
			version: 0,
			statisticalData: []
		}
	},
	computed: {
		data () {
			const { statisticalData, location, frame } = this

			let data = [...statisticalData]

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
		image () {
			const { picture, version } = this
			return picture.image[version] || null
		},
		frame () {
			const { image, picture } = this
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

			return calibration ? 
			{
				ra: calibration.ra,
				dec: calibration.dec,
				radius: calibration.radius,
				w: sizes['large-width'] * calibration.pixscale / 3600,
				h: sizes['large-height'] * calibration.pixscale / 3600,
				o: calibration.parity === 1 ? calibration.orientation : calibration.orientation + 180
			} : null
		},
		timestamp () {
			const { timestamp } = this.picture
			return timestamp
		},
		location () {
			const { location } = this.picture
			return location[0] || null
		}
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
	},
	head () {
		return this.meta
	}

}
</script>

<style lang="scss" scoped>
	.picture-grid {
		display: grid;
		grid-template-areas: "image title" "image sidebar" "content sidebar" "graph sidebar";
		grid-template-columns: auto 350px;
		grid-template-rows: auto auto auto;
		gap: 24px;
	}

	.picture__title {
		grid-area: title;
	}

	.picture__image {
		grid-area: image;
	}

	.picture__content {
		grid-area: content;
	}

	.picture__sidebar {
		grid-area: sidebar;

		& > div:first-child {
			margin-top: 0;
		}
	}

	.picture__graph {
		grid-area: graph;
	}

</style>
