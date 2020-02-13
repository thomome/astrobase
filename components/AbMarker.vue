<template>
	<MglMarker
		:coordinates="location.coords"
	>
		<div slot="marker" class="map-marker" />
		<MglPopup
			:closeOnClick="false"
			:closeButton="false"
			:showed="true"
			:offset="30"
			:onlyText="false"
		>
			<div>
				<div class="text-base font-medium text-white mb-1">
					{{ location.title }}
				</div>
				<p class="text-sm leading-tight">
					Elevation: {{ location.elevation }}&#8239;<small>m</small><br>Bortle Class: {{ location.bortle }}
				</p>
				<nuxt-link
					:to="link"
				>
					Show Pictures
				</nuxt-link>
			</div>
		</MglPopup>
	</MglMarker>
</template>

<script>
export default {
	props: {
		location: { type: Object, required: true }
	},
	computed: {
		link () {
			return {
				path: '/pictures',
				query: { locations: [this.location.id] }
			}
		}
	}
}
</script>

<style lang="scss">
	.map-marker {
		@apply w-12 h-12 rounded-full border-dashed border border-white;
		background: rgba(0, 0, 0, 0.2);
	}

	.map {

		.mapboxgl-popup-content {
			@apply py-3 px-4 border border-gray-300 rounded-none bg-gray-900;
		}

		.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
			border-top-color: theme('colors.gray.300');
		}
	}
</style>
