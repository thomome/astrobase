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
				:range="{ min: null, max: null }"
				:selectedPlots="renderedPlots"
				:colors="usedColors"
			/>
		</div>
	</div>
</template>

<script>
import moment from 'moment'

import AbSelect from './AbSelect.vue'
import AbChart from './AbChart.vue'

import Orb from '~/assets/orb/package.js'

export default {
	components: { AbSelect, AbChart },
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
			colors: ['#ddb310', '#00beff', '#b51d14', '#4053d3 ', '#fb49b0', '#00b25d', '#cacaca'],
			plotTypes: [
				{
					id: 'fwhm',
					name: 'FWHM (pixels)'
				}, {
					id: 'median',
					name: 'Median'
				}, {
					id: 'snr',
					name: 'SNR (dB)'
				}, {
					id: 'ecc',
					name: 'Eccentricity'
				}, {
					id: 'weight',
					name: 'Weight (%)'
				}, {
					id: 'objalt',
					name: 'Object Altitude (°)'
				}, {
					id: 'moonalt',
					name: 'Moon Altitude (°)'
				}, {
					id: 'stars',
					name: 'Stars'
				}, {
					id: 'seeing',
					name: 'Seeing FHMW (arcsec)'
				}, {
					id: 'wind',
					name: 'Wind (m/s)'
				}, {
					id: 'obj_altitude',
					name: 'Altitude (degree)'
				}, {
					id: 'cloudcover',
					name: 'Cloud Cover (%)'
				}, {
					id: 'humidity',
					name: 'Humidity (%)'
				}, {
					id: 'gust',
					name: 'Gust (m/s)'
				}, {
					id: 'ambient_temp',
					name: 'Temperatur (°C)'
				}, {
					id: 'focuspos',
					name: 'Focus position'
				}, {
					id: 'exposure',
					name: 'Exposure (s)'
				}
			]
		}
	},
	computed: {
		data () {
			const { statisticalData, location, calibration } = this

			const loc = {
				latitude: location.coords.lat,
				longitude: location.coords.lng,
				altitude: location.elevation
			}
			const luna = new Orb.Luna()
			const obj = {
				ra: calibration.ra / 360 * 24,
				dec: calibration.dec
			}

			const obs = new Orb.Observation({
				observer: loc,
				target: {}
			})

			let data = [ ...statisticalData ]

			data.sort((a, b) => {
				return a.time === b.time ? 0 : a - b
			})

			data = data.map((row, index) => {
				const newRow = { ...row }
				const date = new Date(row.time * 1000)

				obs.target = luna.radec(date)
				const moonPos = obs.azel(date)

				obs.target = obj
				const objPos = obs.azel(date)

				newRow.moonalt = moonPos.elevation.toFixed(1)
				newRow.objalt = objPos.elevation.toFixed(1)

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
