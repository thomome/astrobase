<template>
	<main class="main-content">
		<div class="picture-list container mt-24 md:mt-40">
			<h1 class="text-2xl leading-tight text-gray-200 mb-3 font-light">
				Mask Generator
			</h1>
			<div class="flex">
				<div class="w-64 flex-shrink-0">
					<div class="flex">
						<label class="mr-3 mb-6">
							<span class="text-sm">Type</span>
							<select
								v-model="maskOptions.maskType"
								@change="renderMask"
							>
								<option v-for="(type, index) in maskTypes" :key="index" :value="type.value">{{ type.name }}</option>
							</select>
						</label>
						<label>
							<span class="text-sm">Units</span>
							<select
								v-model="maskOptions.units"
								@change="renderMask"
							>
								<option v-for="(type, index) in unitTypes" :key="index" :value="type.value">{{ type.name }}</option>
							</select>
						</label>
					</div>
					<div class="flex mb-4">
						<label class="mr-3">
							<span class="text-sm">Focal Length</span>
							<input
								v-model.number="maskOptions.focalLength"
								type="number"
								@change="renderMask"
							>
							{{ maskOptions.units }}
						</label>
						<label>
							<span class="text-sm">Aperture ⌀</span>
							<input
								v-model.number="maskOptions.apertureDiameter"
								type="number"
								@change="renderMask"
							>
							{{ maskOptions.units }}
						</label>
					</div>
					<div class="flex mb-4">
						<label class="mr-3">
							<span class="text-sm">Outer Border</span>
							<input
								v-model.number="maskOptions.outerBorder"
								type="number"
								@change="renderMask"
							>
							{{ maskOptions.units }}
						</label>
						<label>
							<span class="text-sm">Bridge</span>
							<input
								v-model.number="maskOptions.bridgeWidth"
								type="number"
								@change="renderMask"
							>
							{{ maskOptions.units }}
						</label>
					</div>
					<div class="flex mb-6">
						<label class="mb-2">
							<span class="text-sm">Bahtinov Ratio</span>
							<input
								v-model.number="maskOptions.bahtinovRatio"
								type="number"
								@change="renderMask"
							>
						</label>
					</div>

					<label class="mb-4">
						Central Obstruction
						<input
							v-model="maskOptions.hasCentralObstruction"
							type="checkbox"
							@change="renderMask"
						>
					</label>
					<div v-if="maskOptions.hasCentralObstruction" class="flex">
						<label class="mr-3">
							<span class="text-sm">Obstruction ⌀</span>
							<input
								v-model.number="maskOptions.centObsDiameter"
								type="number"
								min="1"
								:max="maskOptions.apertureDiameter - maskOptions.innerBorder"
								@change="renderMask"
							>
							{{ maskOptions.units }}
						</label>
						<label>
							<span class="text-sm">Inner Border</span>
							<input
								v-model.number="maskOptions.innerBorder"
								type="number"
								@change="renderMask"
							>
							{{ maskOptions.units }}
						</label>
					</div>
					<div class="mt-10">
						<label class="mb-1">Export as</label>
						<button class="button" @click="exportAs('svg')">
							SVG
						</button>
						<button class="button" @click="exportAs('dxf')">
							DXF
						</button>
					</div>
				</div>
				<div
					:class="['mask w-full pr-10', isRendering ? 'rendering' : '']"
					v-html="svg"
				/>
			</div>
			<div class="mt-12 html-content w-1/2 text-sm">
				<p>Based on the ingenious designs of:</p>
				<ul>
					<li>
						<a target="_blank" href="https://astronomy.ru/forum/index.php/topic,10421.0.html">Pavel Bahtinov</a> (Bahtinov Mask)
					</li>
					<li>
						<a target="_blank" href="https://github.com/cytan299">cytan299</a> (Tri Bahtinov Mask).
					</li>
					<li>
						<a target="_blank" href="https://github.com/satakagi">Satoru Takagi</a> (Improved Tri Bahtinov Mask).
					</li>
					<li>
						<a target="_blank" href="http://www.geoastro.co.uk/careymask.htm">George Carey</a> (Carey Mask).
					</li>
				</ul>
			</div>
		</div>
	</main>
</template>

<script>
import { saveAs } from 'file-saver'

import MaskWorker from '~/assets/astromaskjs/mask.worker.js'
let worker = false
const client = { process }

export default {
	data () {
		const maskTypes = [
			{ name: 'Bahtinov mask', value: 'BahtinovMask' },
			{ name: 'Tri-Bahtinov mask', value: 'TriBahtinovMask' },
			{ name: 'Perpendicular mask', value: 'PerpendicularMask' },
			{ name: 'Carey mask', value: 'CareyMask' }
		]
		const unitTypes = [
			{ name: 'mm', value: 'mm' },
			{ name: 'cm', value: 'cm' },
			{ name: 'inch', value: 'in' }
		]

		return {
			svg: '<svg width="100mm" height="100mm" viewbox="0 0 100 100"><g><circle r="50" cx="50" cy="50" fill="none" stroke-width="0.1" /></g></svg> ',
			isRendering: false,
			maskOptions: {
				units: unitTypes[0].value,
				maskType: maskTypes[0].value,
				outerBorder: 11,
				apertureDiameter: 203.2,
				focalLength: 2032,
				bahtinovRatio: 150,
				slitRatio: 1,
				bridgeWidth: 7,
				hasCentralObstruction: true,
				centObsDiameter: 85,
				innerBorder: 6
			},
			maskTypes,
			unitTypes
		}
	},
	computed: {
		slitWidth () {
			const { focalLength, bahtinovRatio, slitRatio } = this.maskOptions
			return focalLength / bahtinovRatio / (slitRatio + 1) * slitRatio
		},
		stemWidth () {
			const { focalLength, bahtinovRatio, slitRatio } = this.maskOptions
			return focalLength / bahtinovRatio / (slitRatio + 1)
		},
		outerDiameter () {
			const { apertureDiameter, outerBorder } = this.maskOptions
			return apertureDiameter + (2 * outerBorder)
		},
		innerDiameter () {
			const { centObsDiameter, innerBorder } = this.maskOptions
			return centObsDiameter + (2 * innerBorder)
		}
	},
	mounted () {
		if (client) {
			const options = localStorage.getItem('generator.mask.options')
			if (options) {
				this.maskOptions = JSON.parse(options)
			}

			this.renderMask()
		}
	},
	destroyed () {
		worker.terminate()
		worker = false
	},
	methods: {
		exportAs (type = 'svg') {
			if (!this.isRendering) {
				worker.postMessage({
					type: `export.${type}`,
					options: {
						unit: this.maskOptions.units
					}
				})
			}
		},
		createWorker () {
			const { maskType, focalLength, apertureDiameter, units } = this.maskOptions

			worker = new MaskWorker()
			worker.onmessage = ({ data }) => {
				switch (data.type) {
				case 'render.svg':
					this.svg = data.content
					this.isRendering = false
					break
				case 'export.svg':
				case 'export.dxf':
					saveAs(data.content, `${maskType}_${focalLength}${units}_${apertureDiameter}${units}.${data.fileType}`)
					break
				}
			}
		},
		renderMask () {
			const { maskType, apertureDiameter, bridgeWidth, centObsDiameter, hasCentralObstruction, units } = this.maskOptions
			const { slitWidth, stemWidth, outerDiameter, innerDiameter } = this

			const options = {
				maskType,
				units,
				outerDiameter,
				apertureDiameter,
				slitWidth,
				stemWidth,
				bridgeWidth,
				centObsDiameter: hasCentralObstruction ? innerDiameter : 0,
				innerDiameter: hasCentralObstruction ? centObsDiameter : 0
			}

			if (client) {
				if (!worker) {
					this.createWorker()
				} else if (this.isRendering) {
					worker.terminate()
					this.createWorker()
				}
			}

			if (worker) {
				this.isRendering = true
				worker.postMessage({
					type: 'render.svg',
					options
				})
			}

			if (client) {
				localStorage.setItem('generator.mask.options', JSON.stringify(this.maskOptions))
			}
		}
	},
	head () {
		const meta = {
			title: `Mask Generator - Astrobase`,
			meta: [
				{ property: 'og:type', content: 'website' },
				{ property: 'og:title', content: 'Mask Generator' },
				{ property: 'og:description', content: 'A tool to generate your Bahtinov mask, Tri-Bahtinov mask and other types of astrophotography masks.' }
			]
		}
		return meta
	}
}
</script>

<style lang="scss">
	.mask {
		&.rendering svg path,
		&.rendering svg circle {
			animation: rendering 2s infinite alternate both;
		}

		svg {
			width: 100%;
			height: 100%;

			g {
				stroke: #ffffff !important;
				stroke-width: 0.15mm !important;
				fill: none;
			}
		}
	}

	@keyframes rendering {
		0% {
			stroke-dasharray: 50px 1px;
			stroke-dashoffset: 0;
		}
		100% {
			stroke-dasharray: 1px 50px;
			stroke-dashoffset: 50px;
		}
	}
</style>
