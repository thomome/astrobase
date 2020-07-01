<template>
	<div ref="container" class="skymap__container">
		<div id="skymap" class="skymap" />
	</div>
</template>

<script>
export default {
	props: {
		ra: { type: Number, default: 0 },
		dec: { type: Number, default: 0 },
		lat: { type: Number, default: 0 },
		lon: { type: Number, default: 0 },
		width: { type: Number, default: 0 },
		height: { type: Number, default: 0 },
		orientation: { type: Number, default: 0 }
	},
	computed: {
		fov () {
			return Math.sqrt(this.width ** 2 + this.height ** 2) * 6
		}
	},
	mounted () {
		const { ra, dec, lat, lon, width, height, orientation } = this
		const Celestial = this.$celestial

		const config = {
			projection: 'airy',
			center: [ra, dec],
			geopos: [lat, lon],
			zoomlevel: 100 - Math.sqrt(width ** 2 + height ** 2) / 6 * 100,
			zoomextend: 100,
			form: false,
			interactive: false,
			location: false,
			controls: false,
			container: 'skymap',
			datapath: 'https://ofrohn.github.io/data/',
			stars: {
				names: false,
				colors: false
			},
			dsos: {
				show: true,
				names: true,
				colors: false,
				data: 'dsos.14.json',
				limit: 14
			},
			mw: {
				show: false
			},
			lines: {
				graticule: { show: true, stroke: '#cccccc', width: 0.6, opacity: 0.8, lon: { pos: [''], fill: '#eee', font: '10px Helvetica, Arial, sans-serif' }, lat: { pos: [''], fill: '#eee', font: '10px Helvetica, Arial, sans-serif' } },
				equatorial: { show: false },
				ecliptic: { show: false },
				galactic: { show: false },
				supergalactic: { show: false }
			}
		}

		const lineStyle = {
			stroke: 'rgba(255, 213, 0, 1)',
			fill: 'rgba(255, 213, 0, 0.2)',
			width: 1
		}
		const textStyle = {
			fill: 'rgba(255, 213, 0, 1)',
			font: '14px Helvetica, Arial, sans-serif',
			align: 'left',
			baseline: 'bottom'
		}

		const jsonLine = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					id: 'frame',
					properties: {
						n: `${Math.round(width * 10) / 10}° x ${Math.round(height * 10) / 10}°`,
						loc: [ra, dec],
						w: width,
						h: height,
						o: orientation
					},
					geometry: {
						type: 'Point',
						coordinates: [ra, dec]
					}
				}
			]
		}

		Celestial.clear()

		Celestial.add({
			type: 'line',
			callback: (error, json) => {
				if (error) {
					return false
				}
				const asterism = Celestial.getData(jsonLine, config.transform)
				Celestial.container.selectAll('.asterisms')
					.data(asterism.features)
					.enter().append('path')
					.attr('class', 'ast')
				Celestial.redraw()
			},
			redraw: () => {
				Celestial.container.selectAll('.ast').each((d) => {
					Celestial.setStyle(lineStyle)
					const pt = Celestial.mapProjection(d.geometry.coordinates)
					const hcompare = Celestial.mapProjection([d.geometry.coordinates[0], d.geometry.coordinates[1] + d.properties.h])
					const ratio = (pt[1] - hcompare[1]) / d.properties.h
					const w = ratio * d.properties.w
					const h = ratio * d.properties.h
					const pts = [
						this.rotateVector(pt, [-w / 2, -h / 2], d.properties.o),
						this.rotateVector(pt, [w / 2, -h / 2], d.properties.o),
						this.rotateVector(pt, [w / 2, h / 2], d.properties.o),
						this.rotateVector(pt, [-w / 2, h / 2], d.properties.o)
					]

					const top = pts.reduce((a, c) => {
						return a[1] > c[1] ? c : a
					}, [Infinity, Infinity])

					Celestial.context.beginPath()
					Celestial.context.moveTo(pts[0][0], pts[0][1])
					Celestial.context.lineTo(pts[1][0], pts[1][1])
					Celestial.context.lineTo(pts[2][0], pts[2][1])
					Celestial.context.lineTo(pts[3][0], pts[3][1])
					Celestial.context.closePath()

					Celestial.context.fill()
					Celestial.context.stroke()
					if (Celestial.clip(d.properties.loc)) {
						Celestial.setTextStyle(textStyle)
						Celestial.context.fillText(d.properties.n, top[0], top[1])
					}
				})
			}
		})

		Celestial.display(config)
		Celestial.resize(this.$refs.container.clientWidth)
	},
	methods: {
		rotateVector (c, p, deg) {
			const rad = deg * Math.PI / 180
			const radSin = Math.sin(rad)
			const radCos = Math.cos(rad)

			const point = [ c[0] + ((p[0] * radCos) - (p[1] * radSin)), c[1] + ((p[0] * radSin) + (p[1] * radCos)) ]
			return point
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
