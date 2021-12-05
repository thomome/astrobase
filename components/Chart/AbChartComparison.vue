<template>
	<div class="chart-comparision">
		<div class="flex justify-end items-end mb-2">
			<div class="mb-2">
				<button
					v-for="preset in presets"
					:key="preset.title"
					class="button sm ml-2"
					type="color"
					@click="usePreset(preset)"
				>
					{{ preset.title }}
				</button>
			</div>
		</div>

		<ab-select
			:on-change="updatePlots"
			:values="valuePlots"
			:options="possiblePlots"
			:multiple="true"
			class="w-full mb-1"
			label-key="name"
			params-key="plots"
		/>
		<div
			v-if="possibleSeries.length > 1"
			class="chart-comparision__legend mt-6 flex justify-end"
		>
			<button
				v-for="serie in possibleSeries"
				:key="serie.id"
				class="chart-comparision__legend-item flex items-center ml-4 text-xs p-1"
				@click="() => { updateSeries(serie.id) }"
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
				:data-series="dataSeriesFiltered"
				:data-key="plot.id"
				:title="plot.name"
				:unit="plot.unit"
				:range="range"
				:selected-plots="renderedPlots"
				:colors="usedColors"
			/>
		</div>
		<div>
			<ab-chart-range
				v-if="renderedPlots.length > 0"
				:series="dataSeriesFiltered"
				:on-change="updateRange"
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
				},
				{
					title: 'Guiding Stats',
					plots: ['rms_ra', 'rms_dec', 'rms_total', 'fwhmArc']
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
					id: 'rms_ra',
					name: 'RMS RA',
					unit: '″'
				}, {
					id: 'rms_dec',
					name: 'RMS DEC',
					unit: '″'
				}, {
					id: 'rms_total',
					name: 'RMS Total',
					unit: '″'
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
