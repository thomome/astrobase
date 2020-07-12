<template>
	<div class="skymap__container">
		<canvas ref="container" class="skymap" />
	</div>
</template>

<script>
import StelWebEngine from 'assets/stellarium-web-engine'
// import { julian, coord, sidereal } from 'astronomia'

const client = process.client

export default {
	props: {
		ra: { type: Number, default: 0 },
		dec: { type: Number, default: 0 },
		lat: { type: Number, default: 0 },
		lon: { type: Number, default: 0 },
		width: { type: Number, default: 0 },
		height: { type: Number, default: 0 },
		time: { type: Number, default: Date.now() },
		orientation: { type: Number, default: 0 }
	},
	data () {
		return {
			stel: null
		}
	},
	computed: {
		fov () {
			return Math.sqrt(this.width ** 2 + this.height ** 2) * 6
		}
	},
	mounted () {
		const { lat, lon, time } = this

		const gDate = new Date(time)
		const BASE_URL = '/data/'

		if (client) {
			const engine = StelWebEngine({
				wasmFile: '/stellarium-web-engine.wasm',
				canvas: this.$refs.container,
				res: ['http://stelladata.noctua-software.com/surveys/stars/info.json'],
				onReady: () => {
					engine.then((stel) => {
						stel.core.stars.addDataSource({ url: BASE_URL + 'skydata/stars' })
						stel.core.skycultures.addDataSource({ url: BASE_URL + 'skydata/skycultures/western', key: 'western' })
						stel.core.dsos.addDataSource({ url: BASE_URL + 'skydata/dso' })
						stel.core.landscapes.addDataSource({ url: BASE_URL + 'skydata/landscapes/guereins', key: 'guereins' })
						stel.core.milkyway.addDataSource({ url: BASE_URL + 'skydata/surveys/milkyway' })
						stel.core.minor_planets.addDataSource({ url: BASE_URL + 'skydata/mpcorb.dat', key: 'mpc_asteroids' })
						stel.core.planets.addDataSource({ url: BASE_URL + 'skydata/surveys/sso/moon', key: 'moon' })
						stel.core.planets.addDataSource({ url: BASE_URL + 'skydata/surveys/sso/sun', key: 'sun' })
						stel.core.planets.addDataSource({ url: BASE_URL + 'skydata/surveys/sso/moon', key: 'default' })
						stel.core.comets.addDataSource({ url: BASE_URL + 'skydata/CometEls.txt', key: 'mpc_comets' })
						stel.core.satellites.addDataSource({ url: BASE_URL + 'skydata/tle_satellite.jsonl.gz', key: 'jsonl/sat' })

						stel.core.observer.refraction = false
						stel.core.dss.visible = false
						stel.core.observer.utc = stel.date2MJD(gDate)
						stel.core.lines.equatorial.visible = true
						stel.core.milkyway.visible = false
						stel.core.landscapes.visible = false
						stel.core.atmosphere.visible = false
						stel.core.constellations.lines_visible = true
						stel.core.constellations.lines_animation = false
						stel.core.constellations.show_only_pointed = false
						stel.core.observer.latitude = lat * stel.D2R
						stel.core.observer.longitude = lon * stel.D2R
						stel.core.observer.elevation = 500
						stel.core.fov = Math.sqrt(this.width ** 2 + this.height ** 2) * 1.5 * stel.D2R

						const center = stel.createObj('star', {
							id: 'my star',
							model_data: {
								ra: this.ra,
								de: this.dec,
								vmag: 0
							}
						})

						const dist = Math.sqrt(this.width ** 2 + this.height ** 2) / 2
						const angle = Math.atan((this.height / 2) / (this.width / 2))
						const orientation = (90 + this.orientation) * stel.D2R

						const corners = [
							this.rotateVector(this.ra, this.dec, dist, orientation + angle),
							this.rotateVector(this.ra, this.dec, dist, orientation - angle),
							this.rotateVector(this.ra, this.dec, dist, orientation + angle + Math.PI),
							this.rotateVector(this.ra, this.dec, dist, orientation - angle + Math.PI),
							this.rotateVector(this.ra, this.dec, dist, orientation + angle)
						]

						const frame = stel.createObj('geojson', {
							data: {
								type: 'FeatureCollection',
								features: [{
									type: 'Feature',
									properties: {
										fill: '#FFD500',
										'fill-opacity': 0.2,
										'stroke': '#FFD500'
									},
									'geometry': {
										'type': 'Polygon',
										'coordinates': [corners]
									}
								}]
							}
						})

						const layer = stel.createLayer({ id: 'slayer', z: 50, visible: true })
						layer.add(frame)
						const azalt = stel.convertFrame(stel.observer, 'ICRF', 'OBSERVED', center.getInfo('radec'))
						stel.lookAt(azalt, 0)
					})
				}
			})
		} else {
			console.log(StelWebEngine)
		}
	},
	methods: {
		rotateVector (ra, dec, dist, brng) {
			const { sin, asin, cos, atan2, PI } = Math
			ra = ra / 180 * PI
			dec = dec / 180 * PI
			dist = dist / 180 * PI

			const dec2 = asin(sin(dec) * cos(dist) + cos(dec) * sin(dist) * cos(brng))
			const ra2 = ra + atan2(sin(brng) * sin(dist) * cos(dec), cos(dist) - sin(dec) * sin(dec2))

			return [ra2 / PI * 180, dec2 / PI * 180]
		}
	}
}
</script>

<style lang="scss" scoped>
	.skymap__container {
		@apply relative w-full h-0;
		padding-bottom: 100%;
	}

	.skymap {
		@apply top-0 left-0 w-full h-full;
		position: absolute !important;
	}
</style>
