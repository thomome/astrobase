<template>
	<div class="chart-comparision">
		<button
			v-for="preset in presets"
			:key="preset.title"
			type="color"
			@click="usePreset(preset)"
		>
			{{ preset.title }}
		</button>

		<ab-select
			:on-change="updatePlots"
			:values="valuePlots"
			:options="possiblePlots"
			:multiple="true"
			label="Plots"
			label-key="name"
			params-key="plots"
			class="w-full mb-1"
		/>
		<div
			v-if="possibleSeries.length > 1"
			class="chart-comparision__legend mt-6 flex justify-end"
		>
			<button
				v-for="serie in possibleSeries"
				:key="serie.id"
				@click="() => { updateSeries(serie.id) }"
				class="chart-comparision__legend-item flex items-center ml-4 text-xs p-1"
			>
				<div
					:style="serie.active ? `background: ${serie.color}` : ''"
					:class="`legend-item__dot w-3 h-3 mr-2 rounded-sm ${!serie.active ? 'border' : ''}`"
				/>
				{{ serie.name }}
			</button>
		</div>
		<div>
			<ab-chart
				v-for="plot in renderedPlots"
				:key="plot.id"
				:data="data"
				:dataSeries="dataSeriesFiltered"
				:data-key="plot.id"
				:title="plot.name"
				:unit="plot.unit"
				:range="range"
				:selectedPlots="renderedPlots"
				:colors="usedColors"
			/>
		</div>
		<div>
			<ab-chart-range
				v-if="renderedPlots.length > 0"
				:series="dataSeriesFiltered"
				:onChange="updateRange"
				:range="range"
			/>
		</div>
	</div>
</template>

<script>
import moment from 'moment'
import AbChartRange from '~/components/Chart/AbChartRange.vue'
import AbChart from '~/components/Chart/AbChart.vue'
import AbSelect from '~/components/AbSelect.vue'

export default {
	components: { AbSelect, AbChart, AbChartRange },
	props: {
		data: { type: Array, required: true }
	},
	data () {
		return {
			activeIndex: null,
			selectedPlots: [],
			disabledSeries: [],
			range: { min: null, max: null },
			colors: ['#ddb310', '#00beff', '#b51d14', '#4053d3 ', '#fb49b0', '#00b25d', '#cacaca'],
			presets: [
				{
					title: 'Image Stats',
					plots: ['fwhmArc', 'median', 'snr', 'ecc']
				},
				{
					title: 'Seeing Stats',
					plots: ['objAlt', 'moonAlt', 'seeing', 'cloudCover']
				}
			],
			plotTypes: [
				{
					id: 'fwhm',
					name: 'FWHM',
					unit: 'px'
				}, {
					id: 'fwhmArc',
					name: 'FWHM',
					unit: '″'
				}, {
					id: 'median',
					name: 'Median ADU'
				}, {
					id: 'snr',
					name: 'SNR',
					unit: 'dB'
				}, {
					id: 'ecc',
					name: 'Eccentricity'
				}, {
					id: 'weight',
					name: 'Weight',
					unit: '%'
				}, {
					id: 'objAlt',
					name: 'Object Altitude',
					unit: 'deg'
				}, {
					id: 'moonAlt',
					name: 'Moon Altitude',
					unit: 'deg'
				}, {
					id: 'stars',
					name: 'Stars'
				}, {
					id: 'seeing',
					name: 'Seeing FHMW',
					unit: '″'
				}, {
					id: 'wind',
					name: 'Wind',
					unit: 'm/s'
				}, {
					id: 'cloudCover',
					name: 'Cloud Cover',
					unit: '%'
				}, {
					id: 'humidity',
					name: 'Humidity',
					unit: '%'
				}, {
					id: 'gust',
					name: 'Gust',
					unit: 'm/s'
				}, {
					id: 'ambientTemp',
					name: 'Temperatur',
					unit: '°C'
				}, {
					id: 'focusPos',
					name: 'Focus position'
				}, {
					id: 'exposure',
					name: 'Exposure Time',
					unit: 's'
				}, {
					id: 'corrRaMedian',
					name: 'Guide Correction Median (RA)',
					unit: '″'
				}, {
					id: 'corrRaPeak',
					name: 'Guide Correction Peak (RA)',
					unit: '″'
				}, {
					id: 'corrRaMean',
					name: 'Guide Correction Mean (RA)',
					unit: '″'
				}, {
					id: 'corrDecMedian',
					name: 'Guide Correction Median (DEC)',
					unit: '″'
				}, {
					id: 'corrDecPeak',
					name: 'Guide Correction Peak (DEC)',
					unit: '″'
				}, {
					id: 'corrDecMean',
					name: 'Guide Correction Mean (DEC)',
					unit: '″'
				}, {
					id: 'errRaMedian',
					name: 'Guide Error Median (RA)',
					unit: '″'
				}, {
					id: 'errRaPeak',
					name: 'Guide Error Peak (RA)',
					unit: '″'
				}, {
					id: 'errRaMean',
					name: 'Guide Error Mean (RA)',
					unit: '″'
				}, {
					id: 'errDecMedian',
					name: 'Guide Error Median (DEC)',
					unit: '″'
				}, {
					id: 'errDecPeak',
					name: 'Guide Error Peak (DEC)',
					unit: '″'
				}, {
					id: 'errDecMean',
					name: 'Guide Error Mean (DEC)',
					unit: '″'
				}
			]
		}
	},
	computed: {
		dataSeries () {
			const { data } = this

			let index = 0
			let sessionStart = 0
			let lastTime = 0
			const series = []

			data.forEach((o, i) => {
				o = { ...o }
				const time = parseInt(o.timestamp)
				if (lastTime + 8 * 60 * 60 < time) {
					sessionStart = moment.unix(time).add(-8, 'hours').startOf('day').unix()
					if (lastTime !== 0) {
						index++
					}
				}
				if (!series[index]) {
					series[index] = []
				}

				series[index].push({
					...o,
					time: time - sessionStart
				})
				lastTime = time
			})

			return series
		},
		dataSeriesFiltered () {
			const { dataSeries, disabledSeries } = this
			return dataSeries.filter(s => !disabledSeries.includes(s[0].timestamp))
		},
		possibleSeries () {
			const { dataSeries, disabledSeries, colors } = this
			return dataSeries.map((serie, index) => {
				const id = serie[0].timestamp
				return {
					id,
					name: moment.unix(serie[0].timestamp).format('D. MMMM YYYY'),
					active: !disabledSeries.includes(id),
					color: colors[index]
				}
			})
		},
		usedColors () {
			const { possibleSeries } = this
			const usedColors = []
			possibleSeries.forEach((serie) => {
				if (serie.active) {
					usedColors.push(serie.color)
				}
			})
			return usedColors
		},
		possiblePlots () {
			const { plotTypes, data } = this
			return plotTypes.filter((plot) => {
				return data.some((d) => {
					return typeof d.values[plot.id] !== 'undefined'
				})
			})
		},
		renderedPlots () {
			const { possiblePlots, selectedPlots } = this
			const possiblePlotsMap = {}
			possiblePlots.forEach((plot) => {
				possiblePlotsMap[plot.id] = plot
			})
			return selectedPlots.filter(plot => possiblePlotsMap[plot.id])
		},
		valuePlots () {
			const { renderedPlots } = this
			return renderedPlots.map(plot => plot.id)
		}
	},
	mounted () {
		const selectedPlotsString = localStorage.getItem('selectedPlots')

		let selectedPlots = []
		if (selectedPlotsString) {
			try {
				selectedPlots = JSON.parse(selectedPlotsString)
			} catch {
				selectedPlots = []
			}
		}

		this.selectedPlots = selectedPlots
	},
	methods: {
		usePreset (preset) {
			const plots = preset.plots.map((plot) => {
				return this.possiblePlots.find(({ id }) => plot === id)
			}).filter(plot => plot?.id)
			this.updatePlots('', plots)
		},
		updateRange (min, max) {
			this.range = { min, max }
		},
		updatePlots (key, newValues) {
			this.selectedPlots = newValues
			localStorage.setItem('selectedPlots', JSON.stringify(this.selectedPlots))
		},
		updateSeries (id) {
			const { disabledSeries } = this
			const index = disabledSeries.indexOf(id)

			if (index !== -1) {
				this.disabledSeries.splice(index, 1)
			} else {
				this.disabledSeries.push(id)
			}
		}
	}
}
</script>

<style lang="scss" scoped>

</style>
