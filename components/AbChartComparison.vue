<template>
	<div class="chart-comparision">
		<ab-select
			:on-change="updateSelected"
			:values="values"
			:options="possiblePlots"
			:multiple="true"
			label="Plots"
			params-key="objects"
			label-key="name"
			class="w-full mb-1"
		/>
		<div>
			<ab-chart
				v-for="plot in renderedPlots"
				:key="plot.id"
				:data="statisticalData"
				:data-key="plot.id"
				:title="plot.name"
				:range="{ min: null, max: null }"
				:selectedPlots="renderedPlots"
			/>
		</div>
	</div>
</template>

<script>
import AbSelect from './AbSelect.vue'
import AbChart from './AbChart.vue'

export default {
	components: { AbSelect, AbChart },
	props: {
		statisticalData: { type: Array, required: true }
	},
	data () {
		return {
			activeIndex: null,
			plotTypes: [
				{
					id: 'snr',
					name: 'SNR (dB)'
				}, {
					id: 'median',
					name: 'Median'
				}, {
					id: 'weight',
					name: 'Weight (%)'
				}, {
					id: 'fwhm',
					name: 'FWHM (arcsec)'
				}, {
					id: 'stars',
					name: 'Stars'
				}, {
					id: 'ecc',
					name: 'Eccentricity'
				},
				{
					id: 'seeing',
					name: 'Seeing FHMW (arcsec)'
				},
				{
					id: 'wind',
					name: 'Wind (m/s)'
				},
				{
					id: 'obj_altitude',
					name: 'Altitude (degree)'
				},
				{
					id: 'cloudcover',
					name: 'Cloud Cover (%)'
				},
				{
					id: 'humidity',
					name: 'Humidity (%)'
				},
				{
					id: 'gust',
					name: 'Gust (m/s)'
				},
				{
					id: 'ambient_temp',
					name: 'Temperatur (°C)'
				},
				{
					id: 'focuspos',
					name: 'Focus position'
				},
				{
					id: 'exposure',
					name: 'Exposure (s)'
				}
			],
			selectedPlots: []
		}
	},
	computed: {
		possiblePlots () {
			const { plotTypes, statisticalData } = this
			return plotTypes.filter(plot => statisticalData[0] && statisticalData[0][plot.id])
		},
		renderedPlots () {
			const { possiblePlots, selectedPlots } = this
			const possiblePlotsMap = {}
			possiblePlots.forEach((plot) => {
				possiblePlotsMap[plot.id] = plot
			})
			return selectedPlots.filter(plot => possiblePlotsMap[plot.id])
		},
		values () {
			const { renderedPlots } = this
			return renderedPlots.map(plot => plot.id)
		}
	},
	mounted () {
		const selectedPlotsString = localStorage.getItem('selectedPlots')

		let selectedPlots = []
		if (selectedPlotsString) {
			selectedPlots = JSON.parse(selectedPlotsString)
		}

		this.selectedPlots = selectedPlots
	},
	methods: {
		updateSelected (key, newValues) {
			this.selectedPlots = newValues
			localStorage.setItem('selectedPlots', JSON.stringify(this.selectedPlots))
		}
	}
}
</script>

<style lang="scss" scoped>

</style>
