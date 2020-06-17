<template>
	<div
		ref="container"
		@wheel="onWheel"
		@mousedown="onMouseDown"
		:class="'astro-picture bg-black overflow-hidden select-none ' + (isFullscreen ? 'fixed w-screen h-screen top-0 left-0 z-50' : 'relative w-full h-full')"
	>
		<div
			v-if="controls"
			class="astro-picture__controls opacity-0 absolute bottom-0 right-0 z-10"
		>
			<button
				v-if="annotations"
				@click="toggleAnnotations"
				class="bg-yellow-400 text-gray-900 p-1 m-2 rounded-lg "
			>
				<ab-icon
					:name="showAnnotations ? 'annotations-on' : 'annotations-off'"
					class="text-2xl"
				/>
			</button>
			<button
				@click="toggleFullscreen"
				class="bg-yellow-400 text-gray-900 p-1 m-2 rounded-lg "
			>
				<ab-icon
					:name="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
					class="text-2xl"
				/>
			</button>
		</div>
		<div
			ref="picture"
			class="astro-picture__container relative w-full h-full"
		>
			<ab-image
				:image="image"
				:style="transform"
				min-size="medium_large"
				class="astro-picture__img block w-full h-full object-cover"
			/>
			<svg
				v-if="annotations"
				v-show="showAnnotations"
				:style="transform"
				:viewBox="viewBox"
				class="astro-picture__annotations absolute left-0 top-0 w-full h-full"
			>
				<g
					:transform="`translate(${group.x}, ${group.y})`"
					class="annotations"
				>
					<ab-picture-annotation
						v-for="annotation in preparedAnnotations"
						:key="annotation.name"
						:annotation="annotation"
						:ratio="ratio"
						:minRadius="minRadius"
						:padding="labelPadding"
					/>
				</g>
			</svg>
		</div>
	</div>
</template>

<script>
import AbIcon from '~/components/AbIcon.vue'
import AbImage from '~/components/AbImage.vue'
import AbPictureAnnotation from '~/components/AbPictureAnnotation.vue'

export default {
	components: { AbPictureAnnotation, AbImage, AbIcon },
	props: {
		annotations: { type: Array, default: () => [] },
		image: { type: Object, required: true },
		controls: { type: Boolean, default: false }
	},
	data () {
		return {
			zoom: 1,
			maxZoom: 5,
			minZoom: 1,
			offset: [0, 0],
			isDragged: false,
			draggStart: [0, 0],
			offsetStart: [0, 0],
			showAnnotations: true,
			isFullscreen: false,
			minRadius: 30,
			labelPadding: {
				x: 8,
				y: 4
			},
			container: {
				width: 0,
				height: 0
			}
		}
	},
	computed: {
		ratio () {
			const { image, container, zoom } = this
			return image.width / image.height < container.width / container.height ? container.width / image.width * zoom : container.height / image.height * zoom
		},
		group () {
			const { image, size, ratio } = this
			return {
				x: (image.width * ratio - size[0]) * -0.5,
				y: (image.height * ratio - size[1]) * -0.5
			}
		},
		preparedAnnotations () {
			const { annotations } = this
			const annotationIndex = {}

			const filteredAnnotations = annotations.filter((a) => {
				const name = a.names[0]
				if (annotationIndex[name]) {
					return false
				} else {
					annotationIndex[name] = true
					return true
				}
			})

			return filteredAnnotations.sort((a, b) => {
				const bR = b.radius || 0
				const aR = a.radius || 0
				return bR - aR
			})
		},
		size () {
			const { container, zoom } = this
			return [container.width * zoom, container.height * zoom]
		},
		transform () {
			const { offset, zoom } = this
			return {
				transform: `translate(${offset[0]}px, ${offset[1]}px) scale(${zoom}) `
			}
		},
		viewBox () {
			const { size } = this
			return `0 0 ${size[0]} ${size[1]}`
		}
	},
	mounted () {
		this.resizeObserver = new ResizeObserver(() => {
			this.container = {
				width: this.$refs.container.clientWidth,
				height: this.$refs.container.clientHeight
			}
		})
		this.resizeObserver.observe(this.$refs.container)

		window.addEventListener('mousemove', this.onMouseMove)
		window.addEventListener('mouseup', this.onMouseUp)
	},
	destroyed () {
		this.resizeObserver.disconnect()

		window.removeEventListener('mousemove', this.onMouseMove)
		window.removeEventListener('mouseup', this.onMouseUp)
	},
	methods: {
		toggleAnnotations () {
			this.showAnnotations = !this.showAnnotations
		},
		toggleFullscreen () {
			this.isFullscreen = !this.isFullscreen
		},
		onWheel (e) {
			if (!this.controls || !this.isFullscreen) {
				return false
			}

			const { zoom, offset, maxZoom, minZoom } = this

			e.preventDefault()

			const rect = this.$refs.container.getBoundingClientRect()
			const offsetX = e.clientX - rect.left
			const offsetY = e.clientY - rect.top

			let newZoom = zoom

			if (e.deltaY < 0) {
				newZoom *= 1.1
			} else {
				newZoom *= (1 / 1.1)
			}

			if (newZoom > maxZoom) {
				newZoom = maxZoom
			} else if (newZoom < minZoom) {
				newZoom = minZoom
			}

			const newOffset = [
				((offset[0] - offsetX) / zoom * newZoom) + offsetX,
				((offset[1] - offsetY) / zoom * newZoom) + offsetY
			]

			this.zoom = newZoom
			this.updateOffset(newOffset)
		},
		onMouseDown (e) {
			if (!this.controls) {
				return false
			}

			this.isDragged = true
			this.draggStart = [e.clientX, e.clientY]
			this.offsetStart = this.offset
		},
		onMouseUp (e) {
			if (!this.controls) {
				return false
			}

			this.isDragged = false
		},
		onMouseMove (e) {
			if (!this.controls) {
				return false
			}

			const { isDragged, offsetStart, draggStart } = this
			if (isDragged) {
				const newOffset = [
					offsetStart[0] - (draggStart[0] - e.clientX),
					offsetStart[1] - (draggStart[1] - e.clientY)
				]
				this.updateOffset(newOffset)
			}
		},
		updateOffset (offset) {
			const { size, container } = this

			if (offset[0] > 0) {
				offset[0] = 0
			} else if (offset[0] < container.width - size[0]) {
				offset[0] = container.width - size[0]
			}

			if (offset[1] > 0) {
				offset[1] = 0
			} else if (offset[1] < container.height - size[1]) {
				offset[1] = container.height - size[1]
			}

			this.offset = offset
		}
	}
}
</script>

<style lang="scss">
	.astro-picture__controls {
		transition: opacity .3s;
	}

	.astro-picture:hover {
		.astro-picture__controls {
			@apply opacity-100;
		}
	}

	.astro-picture__img,
	.astro-picture__annotations {
		transform-origin: 0 0 0;
		user-select: none;
		user-drag: none;
		-webkit-user-drag: none;
	}
</style>
