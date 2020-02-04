<template>
	<client-only>
		<MglMap
			:access-token="accessToken"
			:map-style="mapStyle"
			:minZoom="10"
			:maxZoom="12"
			:center="center"
			:interactive="false"
			class="map"
		>
			<MglMarker
				v-for="location in preparedLocations"
				:key="location.id"
				:coordinates="location.coords"
			>
				<div slot="marker" class="map-marker" />
			</MglMarker>
		</MglMap>
	</client-only>
</template>

<script>
let mapboxgl
if (process.client) {
	mapboxgl = require('mapbox-gl')
}

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
		preparedLocations () {
			if (mapboxgl) {
				return this.locations.map((l) => {
					l.coords = [l.coords.lng, l.coords.lat]
					return l
				})
			} else {
				return this.locations
			}
		},
		center () {
			if (this.preparedLocations.length === 1) {
				return this.preparedLocations[0].coords
			} else if (mapboxgl && this.preparedLocations.length > 1) {
				const bounds = new mapboxgl.LngLatBounds()
				this.preparedLocations.forEach((l) => {
					const coords = mapboxgl.LngLat.convert(l.coords)
					bounds.extend(coords)
				})
				return bounds.getCenter()
			} else {
				return { lng: 0, lat: 0 }
			}
		}
	}
}
</script>

<style src="mapbox-gl/dist/mapbox-gl.css"></style>

<style>
	.map {
		min-height: 500px;
	}

	.map-marker {
		@apply w-12 h-12 rounded-full border-dashed border border-white;
		background: rgba(0, 0, 0, 0.2);
	}
</style>
