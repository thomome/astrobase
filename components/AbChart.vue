<template>
	<client-only>
		<VueApexCharts
			:options="chartOptions"
			:series="series"
			type="line"
			height="120"
		/>
	</client-only>
</template>

<script>
export default {
	components: {
		VueApexCharts: () => import('vue-apexcharts')
	},
	props: {
		title: { type: String, default: '' },
		dataKey: { type: String, required: true },
		data: { type: Array, required: true },
		group: { type: String, default: '' }
	},
	data () {
		return {
			chartOptions: {
				theme: {
					monochrome: {
						enabled: true,
						color: '#FFD500',
						shadeTo: 'light',
						shadeIntensity: 0.65
					}
				},
				chart: {
					id: this.dataKey,
					group: this.group,
					foreColor: '#ababab',
					animations: {
						enabled: false
					},
					toolbar: {
						show: false,
						autoSelected: 'pan'
					}
				},
				grid: {
					borderColor: '#90A4AE33'
				},
				xaxis: {
					type: 'datetime',
					tooltip: {
						enabled: false
					}
				},
				yaxis: {
					forceNiceScale: true,
					title: {
						text: this.title
					},
					labels: {
						minWidth: 50,
						maxWidth: 50
					}
				},
				markers: {
					size: 2,
					strokeWidth: 0,
					hover: {
						sizeOffset: 2
					}
				},
				stroke: {
					curve: 'straight',
					width: 1
				},
				tooltip: {
					followCursor: false,
					theme: 'dark',
					x: {
						show: true,
						format: 'dd.MM.yyyy, HH:mm:ss'
					},
					marker: {
						show: false
					}
				}
			}
		}
	},
	computed: {
		series () {
			const data = []
			this.data.forEach((row) => {
				data.push([
					new Date(row.time * 1000),
					row[this.dataKey]
				])
			})

			return [{
				data,
				name: this.title
			}]
		}
	}
}
</script>

<style lang="scss">
	.apexcharts-canvas {
		.apexcharts-tooltip {
			transition: all 0s;

			&.apexcharts-active {
				transition: all 0s;
			}
		}
	}
</style>
