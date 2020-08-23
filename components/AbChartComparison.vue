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
				group="statisticalPlots"
			/>
		</div>
		<client-only>
			<VueApexCharts
				:options="brushOptions"
				:series="brushSeries"
				type="line"
				height="100"
			/>
		</client-only>
		<ab-chart2
			:data="statisticalData"
			data-key="snr"
			title="SNR (dB)"
			group="statisticalPlots"
			:range="{ min: 1582583732, max: 1582586627 }"
		/>
		<ab-chart2
			:data="statisticalData"
			data-key="median"
			title="Median"
			group="statisticalPlots"
		/>
		<ab-chart2
			:data="statisticalData"
			data-key="fwhm"
			title="FWHM (arcsec)"
			group="statisticalPlots"
		/>
		<ab-chart2
			:data="statisticalData"
			data-key="stars"
			title="Stars"
			group="statisticalPlots"
		/>
	</div>
</template>

<script>
import AbSelect from './AbSelect.vue'
import AbChart from './AbChart.vue'
import AbChart2 from './AbChart2.vue'

let apexcharts
if (process.client) {
	apexcharts = require('apexcharts')
}

export default {
	components: { AbSelect, AbChart, VueApexCharts: () => import('vue-apexcharts'), AbChart2 },
	props: {
		statisticalData: { type: Array, required: true }
	},
	data () {
		return {
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
				}
			],
			selectedPlots: [],
			brushOptions: {
				chart: {
					id: 'summary',
					foreColor: '#ababab',
					toolbar: {
						show: false,
						autoSelected: 'selection'
					},
					animations: {
						enabled: false
					},
					selection: {
						enabled: true,
						fill: {
							color: '#FFD500',
							opacity: 0.1
						},
						stroke: {
							width: 1,
							dashArray: 3,
							color: '#FFD500',
							opacity: 0.4
						},
						xaxis: {
							min: null,
							max: null
						}
					},
					events: {
						selection: (ctx, { xaxis, yaxis }) => {
							this.selectedPlots.forEach((plot) => {
								requestAnimationFrame(() => {
									apexcharts.default.exec(plot.id, 'zoomX', xaxis.min, xaxis.max)
								})
							})
						}
					}
				},
				dataLabels: {
					enabled: false
				},
				stroke: {
					width: 1
				},
				fill: {
					opacity: 1,
					type: 'solid'
				},
				legend: {
					show: false
				},
				grid: {
					borderColor: '#90A4AE33'
				},
				xaxis: {
					type: 'datetime'
				},
				yaxis: {
					labels: {
						formatter: v => '',
						minWidth: 50,
						maxWidth: 50
					}
				},
				tooltip: {
					enabled: false
				}
			}
		}
	},
	computed: {
		brushSeries () {
			const series = []

			this.selectedPlots.forEach((plot) => {
				const data = []
				const max = this.statisticalData.reduce((a, b) => {
					return Math.max(a, b[plot.id])
				}, 0)
				this.statisticalData.forEach((row) => {
					data.push([
						new Date(row.time * 1000),
						row[plot.id] / max
					])
				})

				series.push({
					data,
					name: plot.name
				})
			})

			return series
		}
	},
	methods: {
		updateSelected (key, newValues) {
			this.selectedPlots = newValues
			localStorage.setItem('selectedPlots', JSON.stringify(this.selectedPlots))
			this.selectedPlots.forEach((plot) => {
				apexcharts.default.exec(plot.id, 'resetSeries')
			})
			apexcharts.default.exec('summary', 'resetSeries')
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
	}
}
</script>

<style lang="scss" scoped>

</style>
