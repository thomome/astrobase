<template>
	<client-only>
		<MglMap
			:access-token="accessToken"
			:map-style="mapStyle"
			class="map"
		>
			<MglMarker
				v-for="location in locations"
				:key="location.id"
				:coordinates.sync="location.coords"
				color="green"
			/>
		</MglMap>
	</client-only>
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
	}
}
</script>

<style src="mapbox-gl/dist/mapbox-gl.css"></style>

<style>
	.map {
		min-height: 500px;
	}
</style>
