<template>
	<div ref="container" class="map" />
</template>

<script>
export default {
	props: {
		locations: { type: Array, default: () => [] }
	},
	data () {
		return {
			accessToken: 'pk.eyJ1IjoidGhvbWFzZ3V0aHJ1ZiIsImEiOiJjaWZ3YnA1eHUwMjJ0dDRtN3VndHRvcWR4In0._hj992vpVpdIc3L2njKXwQ',
			mapStyle: 'mapbox://styles/thomasguthruf/ck5zsnrr82hol1ilhd9rilkxl'
		}
	},
	computed: {
		prepLocations () {
			return this.locations.map((l) => {
				l.coords = [l.coords.lng, l.coords.lat]
				return l
			})
		}
	},
	mounted () {
		this.createMap()
	},
	methods: {
		createMap () {
			const { accessToken, mapStyle, prepLocations } = this

			const mapboxgl = require('mapbox-gl')
			mapboxgl.accessToken = accessToken

			let mapCenter = [0, 0]
			if (prepLocations.length === 1) {
				mapCenter = prepLocations[0].coords
			} else if (prepLocations.length > 1) {
				const bounds = new mapboxgl.LngLatBounds()
				prepLocations.forEach((l) => {
					const coords = mapboxgl.LngLat.convert(l.coords)
					bounds.extend(coords)
				})
				mapCenter = bounds.getCenter()
			}

			const map = new mapboxgl.Map({
				container: this.$refs.container,
				style: mapStyle,
				center: mapCenter,
				zoom: 6,
				minZoom: 10,
				maxZoom: 12,
				interactive: false
			})

			prepLocations.forEach((loc) => {
				const popup = new mapboxgl.Popup({
					closeButton: false,
					focusAfterOpen: false,
					closeOnClick: false,
					offset: 30
				}).setHTML(`
					<div>
						<div class="text-base font-normal text-gray-200 mb-1">
						${loc.title}
						</div>
						<p class="text-sm leading-tight">
							Elevation: ${loc.elevation}&#8239;<small>m</small><br>Bortle Class: ${loc.bortle}
						</p>
					</div>
				`)

				const marker = document.createElement('div')
				marker.classList.add('map-marker')

				new mapboxgl.Marker({ element: marker })
					.setLngLat(loc.coords)
					.setPopup(popup)
					.addTo(map)
					.togglePopup()
			})
		}
	}
}
</script>

<style src="mapbox-gl/dist/mapbox-gl.css"></style>

<style lang="scss">
	.map-marker {
		@apply w-12 h-12 rounded-full border-dashed border border-white;
		background: rgba(0, 0, 0, 0.2);
	}

	.map {
		min-height: 600px;

		.mapboxgl-popup-content {
			@apply py-3 px-4 rounded-none bg-gray-900;
		}

		.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
			border-top-color: theme('colors.gray.900');
			margin-top: -1px;
		}
	}
</style>
