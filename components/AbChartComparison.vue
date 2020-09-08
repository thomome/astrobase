<template>
	<div class="chart-comparision">
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

import AbSelect from './AbSelect.vue'
import AbChart from './AbChart.vue'
import AbChartRange from './AbChartRange.vue'

import meeus from '~/assets/meeusjs/index.js'

export default {
	components: { AbSelect, AbChart, AbChartRange },
	props: {
		statisticalData: { type: Array, required: true },
		location: { type: Object, default: () => { return {} } },
		calibration: { type: Object, default: () => { return {} } }
	},
	data () {
		return {
			activeIndex: null,
			selectedPlots: [],
			disabledSeries: [],
			range: { min: null, max: null },
			colors: ['#ddb310', '#00beff', '#b51d14', '#4053d3 ', '#fb49b0', '#00b25d', '#cacaca'],
			plotTypes: [
				{
					id: 'fwhm',
					name: 'FWHM',
					unit: 'px'
				}, {
					id: 'fwhmarc',
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
					id: 'objalt',
					name: 'Object Altitude',
					unit: 'deg'
				}, {
					id: 'moonalt',
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
					id: 'cloudcover',
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
					id: 'ambient_temp',
					name: 'Temperatur',
					unit: '°C'
				}, {
					id: 'focuspos',
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
		data () {
			const { statisticalData, location, calibration } = this

			let data = [ ...statisticalData ]

			data.sort((a, b) => {
				return a.time === b.time ? 0 : a - b
			})

			const obs = meeus.EclCoord.fromWgs84(location.coords.lat, location.coords.lng, location.elevation)
			let obj = null
			if (calibration) {
				obj = new meeus.EqCoord(calibration.ra / 180 * Math.PI, calibration.dec / 180 * Math.PI)
			}

			data = data.map((row, index) => {
				const newRow = { ...row }
				const date = new Date(row.time * 1000)
				const jdo = new meeus.JulianDay(date)

				const moonPos = meeus.Moon.topocentricPosition(jdo, obs, true)
				newRow.moonalt = (moonPos.hz.alt / Math.PI * 180).toFixed(2) * 1
				if (obj) {
					const sidereal = meeus.Sidereal.apparentInRa(jdo)
					const objPos = meeus.Coord.eqToHz(obj, obs, sidereal)
					newRow.objalt = (objPos.alt / Math.PI * 180).toFixed(2) * 1
				}

				if (row.scale && row.fwhm) {
					newRow.fwhmarc = (row.scale * row.fwhm).toFixed(2)
					delete newRow.fwhm
				}

				delete newRow.time

				for (const key in newRow) {
					newRow[key] = parseFloat(newRow[key])
				}

				return {
					index,
					timestamp: parseInt(row.time),
					values: newRow
				}
			})

			return data
		},
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
			return plotTypes.filter(plot => data[0] && data[0].values[plot.id])
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
			selectedPlots = JSON.parse(selectedPlotsString)
		}

		this.selectedPlots = selectedPlots
	},
	methods: {
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
