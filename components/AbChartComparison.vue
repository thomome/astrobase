<template>
	<div class="chart-comparision">
		<ab-select
			:on-change="updateSelected"
			:values="values"
			:options="plotTypes"
			:multiple="true"
			label="Plots"
			params-key="objects"
			label-key="name"
			class="w-full mb-1"
		/>
		<div>
			<ab-chart
				v-for="plot in selectedPlots"
				:key="plot.id"
				:data="statisticalData"
				:data-key="plot.id"
				:title="plot.name"
				:activeIndex="activeIndex"
				:range="{ min: null, max: null }"
				:onActive="(i) => { activeIndex = i }"
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
			values: [],
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
	mounted () {
		const selectedPlotsString = localStorage.getItem('selectedPlots')

		let selectedPlots = []
		let values = []

		if (selectedPlotsString) {
			selectedPlots = JSON.parse(selectedPlotsString)
			selectedPlots.forEach((plot) => {
				values.push(plot.id)
			})
		} else {
			selectedPlots = [this.plotTypes[0]]
			values = [this.plotTypes[0].id]
		}

		this.values = values
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
