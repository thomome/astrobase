<template>
	<div
		ref="container"
		class="ab-chart"
	>
		<svg
			:height="height"
			class="ab-chart__canvas"
		>
			<g
				:transform="`translate(${padding} ${padding})`"
				class="ab-chart__container"
			>
				<g
					:transform="`translate(${plotDim.x} 0)`"
					class="ab-chart__grid"
				>
					<g
						v-for="tic in yTics"
						:key="tic.label"
						:transform="`translate(0 ${tic.y})`"
					>
						<line
							:x2="plotDim.width"
							x1="0"
							y1="0"
							y2="0"
							class="ab-chart__grid-line"
						/>
					</g>
				</g>
				<g
					:transform="`translate(${plotDim.x} ${plotDim.height})`"
					class="ab-chart__x-axis"
				>
					<line
						:x2="plotDim.width"
						x1="0"
						y1="0"
						y2="0"
						class="ab-chart__xtic-line"
					/>
					<g
						v-for="tic in xTics"
						:key="tic.timestamp"
						:transform="`translate(${tic.x} 0)`"
					>
						<line class="ab-chart__xtic-line" x1="0" x2="0" y1="0" y2="5" />
						<text
							class="ab-chart__xtic-text"
						>{{ tic.label }}</text>
					</g>
				</g>
				<g
					:transform="`translate(${plotDim.x} 0)`"
					class="ab-chart__y-axis"
				>
					<g
						:transform="`translate(${-yAxisWidth} ${plotDim.height / 2})`"
						class="ab-chart__title-container"
					>
						<text
							class="ab-chart__title"
						>{{ title }}</text>
					</g>
					<line
						:y2="plotDim.height"
						x1="0"
						x2="0"
						y1="0"
						class="ab-chart__ytic-line"
					/>
					<g
						v-for="tic in yTics"
						:key="tic.label"
						:transform="`translate(0 ${tic.y})`"
					>
						<line class="ab-chart__ytic-line" x1="0" x2="-5" y1="0" y2="0" />
						<text
							class="ab-chart__ytic-text"
						>{{ tic.label }}</text>
					</g>
				</g>
				<g
					ref="plot"
					:transform="`translate(${plotDim.x} 0)`"
					@mousemove="(e) => { setActive(e.clientX) }"
					@mouseleave="(e) => { setActive(0, true) }"
					class="ab-chart__plot"
				>
					<rect
						:width="plotDim.width"
						:height="plotDim.height"
						x="0"
						y="0"
						class="ab-chart__plot-background"
					/>
					<ab-chart-path
						v-for="(serie, index) in seriesNormalized"
						:key="index"
						:serie="serie"
						:width="plotDim.width"
						:height="plotDim.height"
						:color="colors[index]"
						:activeIndex="activeIndex"
					/>
					<line
						v-if="tooltip.active"
						:y2="plotDim.height"
						:transform="`translate(${tooltip.indicator} 0)`"
						x1="0"
						x2="0"
						y1="0"
						class="ab-chart__active-indicator"
					/>
				</g>
			</g>
		</svg>
		<div
			v-if="tooltip.active"
			:style="`transform: translate(${tooltip.x}, ${tooltip.y})`"
			class="ab-chart__tooltip"
		>
			<div class="ab-chart__tooltip-title">
				{{ tooltip.date }}
			</div>
			<div
				v-for="col in tooltip.values"
				:key="col.title"
				:class="`ab-chart__tooltip-value ${col.id === dataKey ? 'active' : ''}`"
			>
				<span>{{ col.title }}:</span> <strong>{{ col.value }}</strong>
			</div>
		</div>
	</div>
</template>

<script>
import moment from 'moment'
import AbChartPath from './AbChartPath.vue'
import { clamp, ceilMinutes, floorMinutes } from '~/helpers/helpers.js'

export default {
	components: { AbChartPath },
	props: {
		title: { type: String, default: '' },
		dataKey: { type: String, required: true },
		data: { type: Array, required: true },
		dataSeries: { type: Array, required: true },
		range: { type: Object, default: () => {} },
		selectedPlots: { type: Array, default: () => [] },
		colors: { type: Array, default: () => [] }
	},
	data () {
		return {
			height: 150,
			width: 400,
			yAxisWidth: 60,
			xAxisHeight: 30,
			padding: 5,
			activeIndex: null
		}
	},
	computed: {
		plotDim () {
			const { width, height, padding, xAxisHeight, yAxisWidth } = this
			return {
				width: width - padding * 2 - yAxisWidth,
				height: height - padding * 2 - xAxisHeight,
				x: yAxisWidth,
				y: xAxisHeight
			}
		},
		series () {
			const { dataSeries, dataKey } = this

			const series = dataSeries.map((serie) => {
				return serie.map((o) => {
					return { ...o, value: o.values[dataKey] }
				})
			})

			return series
		},
		limits () {
			const { series, range } = this

			let ymin = Infinity
			let ymax = -Infinity

			let xmin = Infinity
			let xmax = -Infinity

			if (series.length > 0) {
				series.forEach((serie) => {
					serie.forEach((o) => {
						if (o.value < ymin) {
							ymin = o.value
						}
						if (o.value > ymax) {
							ymax = o.value
						}
					})

					if (serie[0].time < xmin) {
						xmin = serie[0].time
					}
					if (serie[serie.length - 1].time > xmax) {
						xmax = serie[serie.length - 1].time
					}
				})

				xmax = range.max || xmax
				xmin = range.min || xmin

				const yOffset = (ymax - ymin) / 10

				if (ymin === ymax) {
					ymin -= 1
					ymax += 1
				}

				return {
					x: { min: xmin, max: xmax },
					y: { min: ymin - yOffset, max: ymax + yOffset }
				}
			} else {
				return {
					x: { min: 0, max: 1 },
					y: { min: 0, max: 1 }
				}
			}
		},
		seriesNormalized () {
			const { series, limits } = this

			const xRange = limits.x.max - limits.x.min
			const yRange = limits.y.max - limits.y.min

			const seriesNormalized = [ ...series ].map((serie) => {
				const serieNormalized = []
				serie.forEach((o) => {
					const no = { ...o }
					no.x = (no.time - limits.x.min) / xRange
					no.y = 1 - (no.value - limits.y.min) / yRange
					if (no.x >= 0 && no.x <= 1) {
						serieNormalized.push(no)
					}
				})
				return serieNormalized
			})

			return seriesNormalized
		},
		seriesFlat () {
			const { seriesNormalized } = this
			const allSeries = []
			seriesNormalized.forEach((s) => {
				s.forEach((o) => {
					allSeries[o.index] = o
				})
			})

			return allSeries
		},
		seriesFlatSortedByX () {
			const { seriesFlat } = this
			const series = seriesFlat.filter(o => o)
			return [...series].sort((a, b) => {
				return a.x === b.x ? 0 : a.x - b.x
			})
		},
		tooltip () {
			const { activeIndex, seriesFlat } = this

			if (activeIndex !== null && seriesFlat[activeIndex]) {
				const { data, plotDim, yAxisWidth, padding, selectedPlots } = this
				const { width, height } = plotDim

				const o = seriesFlat[activeIndex]
				const col = data[activeIndex]

				const x = o.x * width + padding + yAxisWidth
				const y = o.y * height + padding

				const right = o.x > 0.5

				const values = selectedPlots.map((plot) => {
					return {
						id: plot.id,
						title: plot.name,
						value: col.values[plot.id]
					}
				})

				return {
					active: true,
					x: right ? `calc(${x}px - 100% - 10px)` : `calc(${x}px + 10px)`,
					indicator: o.x * width,
					y: `${y}px`,
					date: moment.unix(o.timestamp).format('D. MMMM YYYY, HH:mm:ss'),
					values
				}
			} else {
				return { active: false }
			}
		},
		xTics () {
			const { limits, plotDim } = this
			const { width } = plotDim

			const tics = []
			if (isFinite(limits.x.min) && isFinite(limits.x.max)) {
				const num = Math.floor(width / 100)
				const range = limits.x.max - limits.x.min
				const step = clamp(floorMinutes(range / num), 300, Infinity)
				const start = ceilMinutes(limits.x.min)

				for (let i = start; i < limits.x.max; i += step) {
					tics.push({
						x: (i - limits.x.min) / range * width,
						timestamp: i,
						label: moment().startOf('day').add(i, 'seconds').format('HH:mm')
					})
				}
			}
			return tics
		},
		yTics () {
			const { limits, plotDim } = this
			const { height } = plotDim

			const tics = []
			if (isFinite(limits.y.min) && isFinite(limits.y.max)) {
				const roundingTo = [1.0, 2.0, 4.0, 5.0, 8.0]

				const num = Math.floor(height / 30)
				const range = limits.y.max - limits.y.min

				let step = 0.0
				let roundingIndex = 0.0
				let roundingPow = 0.0001
				let rounder = 0.0

				while (step === step * 2 && Math.abs(step * num) < 2) {
					rounder = roundingTo[roundingIndex] * roundingPow
					roundingIndex++
					if (roundingIndex >= roundingTo.length) {
						roundingIndex = 0.0
						roundingPow *= 10.0
					}

					step = Math.floor(range / num * rounder) / rounder
				}

				const start = Math.ceil(limits.y.min * rounder) / rounder
				const kAbb = Math.round(limits.y.max).toString().length >= 4

				const relNum = (limits.y.max - start) / step

				for (let i = 0; i < relNum; i++) {
					const y = i * step + start
					tics.push({
						y: height - (y - limits.y.min) / range * height,
						label: kAbb ? `${y / 1000.0}k` : y
					})
				}
			}
			return tics
		}
	},
	mounted () {
		window.addEventListener('resize', this.onResize.bind(this))
		this.onResize()
	},
	destroyed () {
		window.removeEventListener('resize', this.onResize)
	},
	methods: {
		setActive (x, leave) {
			if (leave) {
				this.activeIndex = null
			} else {
				const { seriesFlatSortedByX, plotDim, $refs } = this
				const { width } = plotDim
				const { plot } = $refs

				const rect = plot.getBoundingClientRect()
				const xNormalized = clamp((x - rect.x) / width)

				let closestIndex = 0

				let i = Math.floor((seriesFlatSortedByX.length - 1) * xNormalized)
				let dir = 1
				let dist = Infinity
				let tries = 0
				while (tries < 50) {
					const o = seriesFlatSortedByX[i] || { x: Infinity }
					const d = Math.abs(xNormalized - o.x)
					if (d < dist) {
						closestIndex = o.index
						dist = d
					} else if (dir > 0) {
						dir *= -1
						i += dir
					} else {
						break
					}

					i += dir
					tries++
				}

				if (this.activeIndex !== closestIndex) {
					this.activeIndex = closestIndex
				}
			}
		},
		onResize () {
			const { container } = this.$refs
			if (container && this.width !== container.clientWidth) {
				this.width = container.clientWidth
			}
		}
	}
}
</script>

<style lang="scss" scoped>
	.ab-chart {
		position: relative;
	}

	.ab-chart__canvas {
		width: 100%;
	}

	.ab-chart__title {
		transform-box: fill-box;
		transform-origin: left 75%;
		transform: rotate(-90deg) translate(-50%, 75%);
		font-size: 0.65rem;
		font-weight: 500;
		fill: theme('colors.white');;
	}

	.ab-chart__plot-background {
		fill: transparent;
	}

	.ab-chart__plot-path {
		fill: none;
		stroke: theme('colors.yellow.400');
		stroke-width: 1;
	}

	.ab-chart__plot-dot {
		fill: theme('colors.yellow.400');
		stroke: none;
		transition: r 0.15s;
	}

	.ab-chart__plot-median {
		stroke: theme('colors.gray.100');
		stroke-dasharray: 4px 4px;
		stroke-width: .5;
	}

	.ab-chart__xtic-text,
	.ab-chart__ytic-text {
		fill: theme('colors.gray.200');
		font-size: 0.65rem;
		font-weight: 300;
		transform-box: fill-box;
	}

	.ab-chart__xtic-text {
		text-anchor: middle;
		transform: translateY(calc(100% + 5px));
	}

	.ab-chart__ytic-text {
		text-anchor: end;
		transform: translate(-10px, 25%);
	}

	.ab-chart__xtic-line,
	.ab-chart__ytic-line {
		stroke: theme('colors.gray.400');
	}

	.ab-chart__grid-line {
		stroke: theme('colors.gray.800');
	}

	.ab-chart__active-indicator {
		stroke: theme('colors.gray.100');
		stroke-dasharray: 2px 2px;
		stroke-width: .5;
	}

	.ab-chart__tooltip {
		position: absolute;
		z-index: 10;
		left: 0;
		top: 0;
		background: theme('colors.black');
		padding: 10px;
		pointer-events: none;
	}

	.ab-chart__tooltip-title {
		font-size: 0.65rem;
		margin-bottom: 2px;
	}

	.ab-chart__tooltip-value {
		position: relative;
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: theme('colors.white');

		span {
			margin-right: 1em;
		}

		&.active {
			&::before {
				position: absolute;
				display: block;
				content: '';
				left: -10px;
				top: 0;
				height: 100%;
				width: 2px;
				background: theme('colors.yellow.400');
			}
		}
	}
</style>
