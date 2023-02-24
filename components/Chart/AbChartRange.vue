<template>
	<div
		ref="container"
		class="ab-chart-range select-none"
	>
		<svg
			:height="height"
			class="w-full"
		>
			<g :transform="`translate(${padding} ${padding})`">

				<g
					ref="range"
					:transform="`translate(${dim.x} 0)`"
					@click="reset"
				>
					<g :transform="`translate(0 ${dim.height / 2})`">
						<g
							v-for="tic in tics"
							:key="tic.timestamp"
							:transform="`translate(${tic.x} 0)`"
						>
							<line class="ab-chart-range__tic-line" x1="0" x2="0" y1="0" y2="13" />
						</g>
						<line
							:x2="dim.width"
							class="ab-chart-range__line"
							x1="0"
							y1="0"
							y2="0"
						/>
						<line
							:x2="max * dim.width"
							:x1="min * dim.width"
							y1="0"
							y2="0"
							class="ab-chart-range__selection"
						/>
						<line
							:x2="max * dim.width"
							:x1="max * dim.width"
							y1="-10"
							y2="7"
							class="ab-chart-range__selection-edge"
						/>
						<line
							:x2="min * dim.width"
							:x1="min * dim.width"
							y1="-10"
							y2="7"
							class="ab-chart-range__selection-edge"
						/>
					</g>
					<rect
						:width="dim.width"
						:height="dim.height"
						class="ab-chart-range__background"
						x="0"
						y="0"
						@mousedown="startSelection"
						@touchstart="startSelection"
					/>
					<rect
						:width="(max - min) * dim.width"
						:height="dim.height"
						:x="min * dim.width"
						class="ab-chart-range__bar"
						y="0"
						@mousedown="startDrag"
						@touchstart="startDrag"
					/>
					<rect
						:height="dim.height"
						:x="min * dim.width"
						class="ab-chart-range__resize-min"
						y="0"
						width="30"
						@mousedown="startResizeMin"
						@touchstart="startResizeMin"
					/>
					<rect
						:height="dim.height"
						:x="max * dim.width"
						class="ab-chart-range__resize-max"
						y="0"
						width="30"
						@mousedown="startResizeMax"
						@touchstart="startResizeMax"
					/>
				</g>

				<g :transform="`translate(${dim.x} ${dim.y})`">
					<g
						v-for="tic in tics"
						:key="tic.timestamp"
						:transform="`translate(${tic.x} 0)`"
					>
						<text
							class="ab-chart-range__tic-text"
						>{{ tic.label }}</text>
					</g>
				</g>
			</g>
		</svg>
	</div>
</template>
<script>
import moment from 'moment'


export default {
	components: {},
	props: {
		series: { type: Array, required: true },
		onChange: { type: Function, default: () => {} },
		range: { type: Object, default: () => {} }
	},
	data () {
		return {
			width: 400,
			height: 70,
			yAxisWidth: 60,
			padding: 5,
			minWidth: 40,
			min: 0,
			max: 1,
			mode: null,
			lastClick: 0,
			lastUpdate: 0,
			start: {}
		}
	},
	computed: {
		dim () {
			const { width, height, padding, yAxisWidth } = this
			return {
				width: width - padding * 2 - yAxisWidth,
				height: height - padding * 2,
				x: yAxisWidth,
				y: height - padding * 2
			}
		},
		limit () {
			const { series } = this

			let min = Infinity
			let max = -Infinity

			series.forEach((serie) => {
				const first = serie[0].time
				const last = serie[serie.length - 1].time

				if (first < min) {
					min = first
				}
				if (last > max) {
					max = last
				}
			})
			return {
				min,
				max
			}
		},
		tics () {
			const { series, limit, dim } = this
			const { width } = dim

			const tics = []
			if (series.length > 0) {
				const num = Math.floor(width / 100)
				const range = limit.max - limit.min
				const step = clamp(floorMinutes(range / num), 300, Infinity)
				const start = ceilMinutes(limit.min)

				for (let i = start; i < limit.max; i += step) {
					tics.push({
						x: (i - limit.min) / range * width,
						timestamp: i,
						label: moment().startOf('day').add(i, 'seconds').format('HH:mm')
					})
				}
			}
			return tics
		}
	},
	watch: {
		series () {
			this.min = 0
			this.max = 1
			this.onChange(null, null)
		}
	},
	mounted () {
		const { range, limit } = this
		window.addEventListener('resize', this.onResize.bind(this))
		this.onResize()

		window.addEventListener('mouseup', this.endAction)
		window.addEventListener('mousemove', this.moveAction)
		window.addEventListener('touchend', this.endAction)
		window.addEventListener('touchmove', this.moveAction)

		this.min = range.min ? (range.min - limit.min) / (limit.max - limit.min) : 0
		this.max = range.max ? (range.max - limit.min) / (limit.max - limit.min) : 1
	},
	destroyed () {
		window.removeEventListener('resize', this.onResize)
		window.removeEventListener('mouseup', this.endAction)
		window.removeEventListener('mousemove', this.moveAction)
		window.removeEventListener('touchend', this.endAction)
		window.removeEventListener('touchmove', this.moveAction)
	},
	methods: {
		onResize () {
			const { container } = this.$refs
			if (container && this.width !== container.clientWidth) {
				this.width = container.clientWidth
			}
		},
		reset (e) {
			const { lastClick } = this
			const now = Date.now()
			if (lastClick + 500 > now) {
				this.min = 0
				this.max = 1
				this.onChange(null, null)
			}

			this.lastClick = now
		},
		startSelection (e) {
			if (e.touches && e.touches.length !== 1) {
				return false
			}
			this.mode = 'selection'
			this.start.x = e.touches ? e.touches[0].clientX : e.clientX
		},
		startDrag (e) {
			if (e.touches && e.touches.length !== 1) {
				return false
			}
			this.mode = 'drag'
			this.start.x = e.touches ? e.touches[0].clientX : e.clientX
			this.start.min = this.min
			this.start.max = this.max
		},
		startResizeMin (e) {
			if (e.touches && e.touches.length !== 1) {
				return false
			}
			this.mode = 'resize'
			this.start.x = e.touches ? e.touches[0].clientX : e.clientX
			this.start.min = this.min
		},
		startResizeMax (e) {
			if (e.touches && e.touches.length !== 1) {
				return false
			}
			this.mode = 'resize'
			this.start.x = e.touches ? e.touches[0].clientX : e.clientX
			this.start.max = this.max
		},
		moveAction (e) {
			const { mode, $refs, start, max, min, minWidth } = this
			const { range } = $refs
			const x = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) ? (e.changedTouches ? e.changedTouches[0].clientX : e.touches[0].clientX) : e.clientX
			const rect = range.getBoundingClientRect()
			const w = minWidth / rect.width

			if (mode === 'selection') {
				const begin = clamp((start.x - rect.x) / rect.width)
				let end = clamp((x - rect.x) / rect.width)

				if (end >= begin && end - begin < w) {
					end = begin + w
				} else if (end < begin && begin - end < w) {
					end = begin - w
				}

				this.min = end > begin ? begin : end
				this.max = end > begin ? end : begin
				this.updateRange()
			} else if (mode === 'drag') {
				const offset = clamp((x - start.x) / rect.width, 0 - start.min, 1 - start.max)

				this.min = start.min + offset
				this.max = start.max + offset
				this.updateRange()
			} else if (mode === 'resize') {
				if (typeof start.min === 'number') {
					const offset = clamp((x - start.x) / rect.width, 0 - start.min, max - start.min - w)
					this.min = start.min + offset
				} else if (typeof start.max === 'number') {
					const offset = clamp((x - start.x) / rect.width, min + w - start.max, 1 - start.max)
					this.max = start.max + offset
				}
				this.updateRange()
			}
		},
		endAction (e) {
			const { mode } = this
			if (mode) {
				this.moveAction(e)
				this.updateRange()
			}
			this.start = {}
			this.mode = null
		},
		updateRange () {
			const { min, max, limit, lastUpdate } = this
			const now = Date.now()
			if (lastUpdate + 25 < now) {
				const range = limit.max - limit.min
				this.onChange(limit.min + range * min, limit.min + range * max)
				this.lastUpdate = now
			}
		}
	}
}
</script>
<style lang="scss" scoped>
	.ab-chart-range__tic-text {
		fill: theme('colors.gray.200');
		font-size: 0.65rem;
		font-weight: 300;
		transform-box: fill-box;
		text-anchor: middle;
	}

	.ab-chart-range__background {
		fill: transparent;
		cursor: col-resize;
	}

	.ab-chart-range__line {
		stroke: theme('colors.gray.700');
	}

	.ab-chart-range__tic-line {
		stroke: theme('colors.gray.700');
		transform-box: fill-box;
		transform: translateY(-50%);
	}

	.ab-chart-range__selection {
		stroke: theme('colors.yellow.400');
		stroke-width: 2px;
	}

	.ab-chart-range__selection-edge {
		stroke: theme('colors.yellow.400');
		stroke-width: 1px;
	}

	.ab-chart-range__bar {
		fill: transparent;
		cursor: move;
	}

	.ab-chart-range__resize-min,
	.ab-chart-range__resize-max {
		cursor: ew-resize;
		fill: transparent;
		transform-box: fill-box;
		transform: translateX(-50%);
	}
</style>
