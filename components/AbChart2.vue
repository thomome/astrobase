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
						>{{tic.label}}</text>
					</g>
				</g>
				<g
					ref="plot"
					@mousemove="(e) => { updateTooltip(e.clientX) }"
					@mouseleave="(e) => { updateTooltip(e.clientX, true) }"
					:transform="`translate(${plotDim.x} 0)`"
					class="ab-chart__plot"
				>
					<rect
						x="0"
						y="0"
						:width="plotDim.width"
						:height="plotDim.height"
						class="ab-chart__plot-background"
					/>
					<path
						:d="path"
						class="ab-chart__plot-path"
					/>
					<circle
						v-for="(point, index) in seriesNormalized"
						:key="point.x"
						:cx="point.x * plotDim.width"
						:cy="point.y * plotDim.height"
						:r="index === tooltipIndex ? 4 : 2"
						class="ab-chart__plot-dot"
					/>
				</g>
			</g>
		</svg>
		<div
			v-if="tooltip.active"
			:style="`transform: translate(${tooltip.x}, ${tooltip.y})`"
			class="ab-chart__tooltip"
		>
			<div class="ab-chart__tooltip-title">{{ tooltip.date }}</div>
			<div class="ab-chart__tooltip-value" v-html="tooltip.value"></div>
		</div>
	</div>
</template>

<script>
import moment from 'moment'

export default {
	components: {},
	props: {
		title: { type: String, default: '' },
		dataKey: { type: String, required: true },
		data: { type: Array, required: true },
		group: { type: String, default: '' },
		range: { type: Object, default: () => { return { min: false, max: false } } }
	},
	data () {
		return {
			height: 150,
			width: 400,
			yAxisWidth: 50,
			xAxisHeight: 30,
			padding: 5,
			tooltipIndex: null
		}
	},
	computed: {
		tooltip () {
			const { tooltipIndex } = this
			if (tooltipIndex !== null) {
				const { series, seriesNormalized, plotDim, title, yAxisWidth, padding } = this
				const { width, height } = plotDim

				const itemNormalized = seriesNormalized[tooltipIndex]
				const item = series[itemNormalized.i]

				const x = itemNormalized.x * width + padding + yAxisWidth
				const y = itemNormalized.y * height + padding

				const right = tooltipIndex > seriesNormalized.length / 2

				return {
					active: true,
					x: right ? `calc(${x}px - 100% - 10px)` : `calc(${x}px + 10px)`,
					y: `${y}px`,
					date: moment.unix(item.x).format('D. MMMM YYYY, HH:mm:ss'),
					value: `${title}: <strong>${item.y}</strong>`
				}
			} else {
				return { active: false }
			}
		},
		plotDim () {
			const { width, height, padding, xAxisHeight, yAxisWidth } = this
			return {
				width: width - padding * 2 - yAxisWidth,
				height: height - padding * 2 - xAxisHeight,
				x: yAxisWidth,
				y: xAxisHeight
			}
		},
		xTics () {
			const { series, limits, plotDim } = this
			const { width } = plotDim

			const tics = []
			if (series.length > 0) {
				const num = Math.floor(width / 100)
				const range = limits.x.max - limits.x.min
				const step = this.floorMinutes(range / num)
				const start = this.ceilMinutes(limits.x.min)

				for (let i = start; i < limits.x.max; i += step) {
					tics.push({
						x: (i - limits.x.min) / range * width,
						timestamp: i,
						label: moment.unix(i).format('HH:mm')
					})
				}
			}
			return tics
		},
		yTics () {
			const { series, limits, plotDim } = this
			const { height } = plotDim

			const tics = []
			if (series.length > 0) {
				const roundingTo = [1, 2, 4, 5, 8]

				const num = Math.floor(height / 30)
				const range = limits.y.max - limits.y.min

				let step = 0
				let roundingIndex = 0
				let roundingPow = 0.0001
				let rounder = 0
				while (step === step * 2 && Math.abs(step * num) < 2) {
					rounder = roundingTo[roundingIndex] * roundingPow
					roundingIndex++
					if (roundingIndex >= roundingTo.length) {
						roundingIndex = 0
						roundingPow *= 10
					}
					step = Math.floor(range / num * rounder) / rounder
				}

				const start = Math.ceil(limits.y.min * rounder) / rounder
				const kAbb = Math.round(limits.y.max).toString().length >= 3

				for (let i = start; i < limits.y.max; i += step) {
					tics.push({
						y: height - (i - limits.y.min) / range * height,
						label: kAbb ? `${i / 1000}k` : i
					})
				}
			}
			return tics
		},
		limits () {
			const { series, range } = this

			if (series.length > 0) {
				let ymax = -Infinity
				let ymin = Infinity

				series.forEach((e) => {
					if (e.y > ymax) {
						ymax = e.y
					}
					if (e.y < ymin) {
						ymin = e.y
					}
				})

				const yOffset = (ymax - ymin) / 10

				const xmin = range.min ? range.min : series[0].x
				const xmax = range.max ? range.max : series[series.length - 1].x

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
		series () {
			const { data } = this
			return data.map((o) => {
				return {
					x: o.time,
					y: parseFloat(o[this.dataKey])
				}
			})
		},
		seriesNormalized () {
			const { series, limits } = this

			const xRange = limits.x.max - limits.x.min
			const yRange = limits.y.max - limits.y.min

			const normalized = series.map((o, i) => {
				return {
					x: (o.x - limits.x.min) / xRange,
					y: 1 - (o.y - limits.y.min) / yRange,
					i
				}
			})

			const filtered = normalized.filter(o => o.x > 0 && o.x < 1)

			return filtered
		},
		path () {
			const { seriesNormalized, plotDim } = this
			const { width, height } = plotDim

			let pathString = ''
			seriesNormalized.forEach((o, i) => {
				pathString += i === 0 ? 'M ' : 'L '
				pathString += `${o.x * width} ${o.y * height} `
			})
			return pathString
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
		updateTooltip (x, leave = false) {
			if (leave) {
				this.tooltipIndex = null
			} else {
				const { seriesNormalized, plotDim, $refs } = this
				const { width } = plotDim
				const { plot } = $refs

				const rect = plot.getBoundingClientRect()
				const xNormalized = (x - rect.x) / width

				let closestIndex = 0
				let dist = Infinity
				seriesNormalized.some((o, i) => {
					const d = Math.abs(xNormalized - o.x)
					if (d < dist) {
						closestIndex = i
						dist = d
						return false
					} else {
						return true
					}
				})
				this.tooltipIndex = closestIndex
			}
		},
		floorMinutes (value, minutes = 5) {
			return Math.floor(value / 60 / minutes) * 60 * minutes
		},
		ceilMinutes (value, minutes = 5) {
			return Math.ceil(value / 60 / minutes) * 60 * minutes
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

<style lang="scss">
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

	.ab-chart__tooltip {
		position: absolute;
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
		font-size: 0.75rem;
		color: theme('colors.white');
	}
</style>
