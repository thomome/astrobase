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
					<h1 class="picture__title md:text-3xl text-2xl leading-tight font-light text-gray-200 mt-4 lg:mt-0">
						{{ picture.title }}
					</h1>

					<div class="picture__date-location text-gray-700 text-sm leading-relaxed">
						{{ picture.date }} <span v-if="location"> - {{ location.title }}</span>
					</div>
				</div>

				<!-- Image & description with navigation -->
				<div class="picture__image">
					<div class="flex flex-col relative">
						<ab-picture
							:controls="true"
							:image="image"
							:sizes="`(max-width: ${bp['xl']}) calc(100vw), min(calc(87.5vw - 350px), 1600px)`"
							max-height="80vh"
						/>
						<div class="picture__details md:flex my-4">
							<div class="picture__column max-w-2xl">
								<div class="picture__image-description text-gray-700 text-sm leading-tight border-l border-yellow-400 pl-3 mb-4">
									Version {{ (version + 1) }} (edited on {{ image.date }}) <span v-if="image.description"> - {{ image.description }}</span>
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

				<div class="picture__tabs">
					<div v-if="tabs.length > 1" class="picture__tabs-nav flex mb-6">
						<button
							v-for="(tab, index) in tabs"
							:key="tab.id"
							:class="`section-title border-b py-2 px-4 ${tabIndex === index ? 'border-yellow-400' : 'text-gray-500 border-gray-800'}`"
							@click="tabIndex = index"
						>
							{{ tab.title }}
						</button>
					</div>

					<template v-for="(tab, index) in tabs">
						<!-- Picture text content -->
						<div
							v-if="tab.id === 'description' && index === tabIndex"
							:key="tab.id"
							class="picture__content html-content max-w-6xl font-light text-sm"
							v-html="picture.description"
						/>

						<!-- Subframe graphs -->
						<div
							v-if="tab.id === 'stats' && index === tabIndex"
							:key="tab.id"
							class="picture__graph"
						>
							<ab-chart-comparison
								:data="data"
							/>
						</div>
					</template>
				</div>

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

				<div v-if="picture.related.length > 0" class="picture__related">
					<ab-block-slider :items="picture.related" title="Related pictures">
						<template #item="{ item }">
							<div class="related__item relative">
								<nuxt-link
									:to="`/pictures/${item.id}`"
									:aria-label="picture.title"
								>
									<ab-image
										v-if="item.image[0]"
										:image="item.image[0]"
										:alt="item.title"
										sizes="460px"
									/>
									<div class="related__item-info absolute w-full text-gray-200 bottom-0 left-0 px-3 pb-2 pt-5 bg-gradient-to-t from-gray-900 to-transparent">
										<h4 class="font-medium text-gray-200 leading-tight text-lg">
											{{ item.title }}
										</h4>
										<div class="text-gray-500 text-sm leading-relaxed">
											{{ item.date }}
										</div>
									</div>
								</nuxt-link>
							</div>
						</template>
					</ab-block-slider>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
import Papa from 'papaparse'
import twConfig from '~/tailwind.config'
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
import AbImage from '~/components/AbImage.vue'

export default {
	components: { AbPicture, AbIcon, AbChartComparison, AbObjectList, AbExposureTime, AbCalibration, AbEquipmentList, AbSoftwareList, AbGuiding, AbImage },
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
			statisticalData: [],
			tabIndex: 0
		}
	},
	head () {
		return this.meta
	},
	computed: {
		bp () {
			return twConfig.theme.screens
		},
		tabs () {
			const { description, stats } = this.picture
			const tabs = []

			if (description.length > 0) {
				tabs.push({
					id: 'description',
					title: 'Description'
				})
			}

			if (stats) {
				tabs.push({
					id: 'stats',
					title: 'Statistics'
				})
			}
			return tabs
		},
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

			return calibration
				? {
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
	}
}
</script>

<style lang="scss" scoped>
	.picture-grid {
		display: grid;
		grid-template-areas: "title title" "image image" "tabs tabs" "sidebar sidebar" "related related";
		grid-template-columns: auto 300px;
		grid-template-rows: auto;
		gap: 24px;

		@screen md {
			grid-template-areas: "title title" "image image" "tabs sidebar" "related sidebar";
		}

		@screen xl {
			grid-template-areas: "image title" "image sidebar" "tabs sidebar" "related sidebar";
			grid-template-columns: auto 350px;
		}
	}

	.picture__title {
		grid-area: title;
	}

	.picture__image {
		grid-area: image;
	}

	.picture__tabs {
		grid-area: tabs;
	}

	.picture__sidebar {
		grid-area: sidebar;

		& > div:first-child {
			margin-top: 0;
		}
	}

	.picture__related {
		grid-area: related;
	}

	.related__item {
		img {
			aspect-ratio: 6 / 5 !important;
			object-fit: cover;
		}

		.related__item-info {
			opacity: 0;
			transition: opacity 0.25s;

			* {
				transform: translateY(-10px);
				transition: transform 0.25s;
			}
		}

		&:hover {
			.related__item-info {
				opacity: 1;

				* {
					transform: translateY(0);
				}
			}
		}
	}

</style>
