<template>
	<div
		ref="container"
		@wheel="onWheel"
		@mousedown="onMouseDown"
		@touchstart="onTouchStart"
		@touchend="onTouchEnd"
		@touchmove="onTouchMove"
		@fullscreenchange="onFullscrenChange"
		@click="onClick"
		:class="'astro-picture relative w-full h-full bg-black overflow-hidden select-none ' + (isFullscreen && zoom !== 1 ? 'can-drag' : '') + ' ' + (isDragging && zoom !== 1 ? 'is-dragging' : '')"
	>
		<div
			v-if="controls"
			class="astro-picture__controls absolute bottom-0 right-0 z-10"
		>
			<button
				v-if="preparedAnnotations"
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
				:full="isFullscreen"
				:style="transform"
				:class="'astro-picture__img block w-full h-full ' + (isFullscreen ? 'object-contain pointer-events-none' : 'object-cover')"
				min-size="medium_large"
			/>
			<svg
				v-if="preparedAnnotations"
				v-show="showAnnotations"
				:style="transform"
				:viewBox="viewBox"
				class="astro-picture__annotations absolute left-0 top-0 w-full h-full"
			>
				<g
					:transform="`translate(${svgOffset.x}, ${svgOffset.y})`"
					class="annotations"
				>
					<ab-picture-annotation
						v-for="annotation in preparedAnnotations"
						:key="annotation.name"
						:annotation="annotation"
						:aspectRatio="aspectRatio"
						:minRadius="minRadius"
						:padding="labelPadding"
						:linkDisabled="linksDisabled"
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
		image: { type: Object, required: true },
		controls: { type: Boolean, default: false },
		annotated: { type: Boolean, default: false }
	},
	data () {
		return {
			isZooming: false,
			isDragging: false,
			isFullscreen: false,

			linksDisabled: false,
			showAnnotations: this.annotated,

			zoom: 1,
			minZoom: 1,
			maxZoom: 5,

			dragStart: [0, 0],
			dragOffsetStart: [0, 0],

			zoomStartPos: [0, 0],
			zoomDistStart: 0,
			zoomStart: 1,
			lastClick: 0,

			minRadius: 30,
			labelPadding: {
				x: 8,
				y: 4
			},

			offset: [0, 0],
			container: {
				width: 0,
				height: 0
			}
		}
	},
	computed: {
		aspectRatio () {
			const { isFullscreen, image, container, zoom } = this

			const width = image.sizes['large-width']
			const height = image.sizes['large-height']

			if (isFullscreen) { // to switch between cover and contain
				return width / height > container.width / container.height ? container.width / width * zoom : container.height / height * zoom
			} else {
				return width / height < container.width / container.height ? container.width / width * zoom : container.height / height * zoom
			}
		},
		svgOffset () {
			const { image, size, aspectRatio } = this

			const width = image.sizes['large-width']
			const height = image.sizes['large-height']

			// Keep the svg group in the center
			return {
				x: (width * aspectRatio - size[0]) * -0.5,
				y: (height * aspectRatio - size[1]) * -0.5
			}
		},
		preparedAnnotations () {
			const { annotations } = this.image
			if (!annotations) {
				return false
			}
			const annotationIndex = {}

			// remove dublicates from API
			const filteredAnnotations = annotations.filter((a) => {
				const name = a.name
				if (annotationIndex[name]) {
					return false
				} else {
					annotationIndex[name] = true
					return true
				}
			})

			// sort by radius so small are over large annotations
			return filteredAnnotations.sort((a, b) => {
				const bR = b.radius || 0
				const aR = a.radius || 0
				return bR - aR
			}).slice(0, this.maxAnnotations)
		},
		maxAnnotations () {
			const { size } = this
			// Limit annotations for mobile
			return Math.ceil(size[0] * 0.01)
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
		window.addEventListener('keyup', this.onKeyUp)
	},
	destroyed () {
		this.resizeObserver.disconnect()

		window.removeEventListener('mousemove', this.onMouseMove)
		window.removeEventListener('mouseup', this.onMouseUp)
		window.removeEventListener('keyup', this.onKeyUp)
	},
	methods: {
		toggleAnnotations () {
			this.lastClick = 0
			this.showAnnotations = !this.showAnnotations
		},
		toggleFullscreen () {
			this.lastClick = 0
			if (!this.isFullscreen) {
				this.$refs.container.requestFullscreen()
			} else {
				document.exitFullscreen()
			}
		},
		onFullscrenChange () {
			if (document.fullscreenElement) {
				this.isFullscreen = !this.isFullscreen
			} else {
				this.isFullscreen = !this.isFullscreen
				this.zoom = 1
				this.offset = [0, 0]
			}
		},
		onTouchStart (e) {
			if (!this.isFullscreen || !this.controls) {
				return false
			}

			const { zoom } = this

			if (e.touches.length >= 2) {
				// get center of the two touch points
				this.zoomStartPos = [
					e.touches[0].clientX + (e.touches[1].clientX - e.touches[0].clientX) / 2,
					e.touches[0].clientY + (e.touches[1].clientY - e.touches[0].clientY) / 2
				]
				// get distance between touch points
				this.zoomDistStart = (e.touches[1].clientX - e.touches[0].clientX) ** 2 + (e.touches[1].clientY - e.touches[0].clientY) ** 2
				this.zoomStart = zoom
				this.isZooming = true
			} else if (e.touches.length === 1) {
				this.onMouseDown(e.touches[0])
			}
		},
		onTouchMove (e) {
			if (!this.controls) {
				return false
			}

			if (this.isZooming && e.touches.length >= 2) {
				const { zoomDistStart, zoomStart, zoomStartPos, offset, zoom, minZoom, maxZoom } = this

				const currentDist = (e.touches[1].clientX - e.touches[0].clientX) ** 2 + (e.touches[1].clientY - e.touches[0].clientY) ** 2
				if (currentDist !== zoomDistStart) {
					this.lastClick = 0
				}
				// get ratio between current and start distance between the two touch points
				let newZoom = zoomStart * (currentDist / zoomDistStart)

				if (newZoom > maxZoom) {
					newZoom = maxZoom
				} else if (newZoom < minZoom) {
					newZoom = minZoom
				}

				// calc new image offset top/left
				const newOffset = [
					((offset[0] - zoomStartPos[0]) / zoom * newZoom) + zoomStartPos[0],
					((offset[1] - zoomStartPos[1]) / zoom * newZoom) + zoomStartPos[1]
				]

				this.zoom = newZoom
				this.updateOffset(newOffset)
			} else if (this.isDragging && e.touches.length === 1) {
				this.onMouseMove(e.touches[0])
			}
		},
		onTouchEnd (e) {
			if (!this.controls) {
				return false
			}

			this.zoomStartPos = [0, 0]
			this.isZooming = false
			this.isDragging = false
		},
		onWheel (e) {
			if (!this.controls || !this.isFullscreen) {
				return false
			}

			const { zoom, offset, maxZoom, minZoom } = this

			e.preventDefault()
			this.lastClick = 0

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
		onKeyUp (e) {
			const { isFullscreen } = this
			if (e.key === 'Escape' && isFullscreen) {
				this.isFullscreen = false
			}
		},
		onClick (e) {
			if (!this.isFullscreen || !this.controls) {
				return false
			}

			const { lastClick, zoom, minZoom, maxZoom, offset } = this
			const now = Date.now()

			if (lastClick + 500 > now) {
				const rect = this.$refs.container.getBoundingClientRect()
				const offsetX = e.clientX - rect.left
				const offsetY = e.clientY - rect.top

				const newZoom = zoom >= maxZoom * 0.75 ? minZoom : maxZoom * 0.75

				const newOffset = [
					((offset[0] - offsetX) / zoom * newZoom) + offsetX,
					((offset[1] - offsetY) / zoom * newZoom) + offsetY
				]

				this.zoom = newZoom
				this.updateOffset(newOffset)
				this.lastClick = 0
			} else {
				this.lastClick = now
			}
		},
		onMouseDown (e) {
			if (!this.isFullscreen || !this.controls) {
				return false
			}

			this.isDragging = true
			this.dragStart = [e.clientX, e.clientY]
			this.dragOffsetStart = this.offset
		},
		onMouseUp (e) {
			if (!this.controls) {
				return false
			}

			this.isDragging = false

			requestAnimationFrame(() => {
				this.linksDisabled = false
			})
		},
		onMouseMove (e) {
			if (!this.controls) {
				return false
			}

			const { isDragging, dragOffsetStart, dragStart } = this

			if (isDragging) {
				if (dragStart[0] !== e.clientX || dragStart[1] !== e.clientY) {
					this.lastClick = 0
				}

				const newOffset = [
					dragOffsetStart[0] - (dragStart[0] - e.clientX),
					dragOffsetStart[1] - (dragStart[1] - e.clientY)
				]
				this.updateOffset(newOffset)
				this.linksDisabled = true
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

<style lang="scss" scoped>
	.astro-picture__controls {
		@apply opacity-100;

		@media screen and (min-width: theme('screens.md')) {
			@apply opacity-0;
			transition: opacity .3s;
		}
	}

	.can-drag {
		cursor: grab;
	}

	.is-dragging {
		cursor: grabbing;
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
