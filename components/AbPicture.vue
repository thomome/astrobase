<template>
	<div
		ref="container"
		@mousemove="updateTranslate"
		@wheel="updateScale"
		class="astro-picture relative w-full h-full overflow-hidden"
	>
		<div
			v-if="controls"
			class="astro-picture__controls opacity-0 absolute bottom-0 right-0 z-10"
		>
			<button
				@click="showAnnotations = !showAnnotations"
				class="bg-yellow-400 text-gray-900 p-1 m-2 rounded-lg "
			>
				<ab-icon
					:name="showAnnotations ? 'annotations-on' : 'annotations-off'"
					class="text-2xl"
				/>
			</button>
		</div>
		<div
			ref="picture"
			class="astro-picture__container relative w-full h-full"
			:style="transform"
		>
			<ab-image
				:image="image"
				min-size="medium_large"
				class="astro-picture__img block w-full h-full object-cover"
			/>
			<svg
				v-show="showAnnotations"
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
			size: [0, 0],
			translate: [0, 0],
			showAnnotations: true,
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
			const { image, container } = this
			return image.width / image.height < container.width / container.height ? container.width / image.width : container.height / image.height
		},
		group () {
			const { image, container, ratio } = this
			return {
				x: (image.width * ratio - container.width) * -0.5,
				y: (image.height * ratio - container.height) * -0.5
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
		transform () {
			return {
				left: `${this.translate[0]}px`,
				top: `${this.translate[1]}px)`,
				width: `${this.size[0]}px`,
				height: `${this.size[1]}px`
			}
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
	},
	destroyed () {
		this.resizeObserver.disconnect()
	},
	methods: {
		updateScale (e) {
			const box = this.$refs.container.getBoundingClientRect()
			const add = e.deltaY / Math.abs(e.deltaY) * -0.2
			let scale = this.scale * (1 + add)

			if (scale < 1) {
				scale = 1
			} else if (scale > 4) {
				scale = 4
			}

			const { x: cX, y: cY } = this.getPos(this.$refs.container, e)
			const { x: pX, y: pY } = this.getPos(this.$refs.picture, e)

			const width = box.width * this.scale
			const height = box.height * this.scale

			const left = (width * pX - box.width * cX)
			const top = (height * pY - box.height * cY)

			this.scale = scale

			this.translate = [
				left,
				top
			]
		},
		getPos (el, e) {
			const w = el.clientWidth
			const h = el.clientHeight

			const r = el.getBoundingClientRect()
			const x = e.clientX - r.left
			const y = e.clientY - r.top

			return {
				x: x / w,
				y: y / h
			}
		},
		updateTranslate (e) {
			/* const box = this.$refs.picture.getBoundingClientRect()

			const left = ((e.pageX - box.left) / box.width)
			const top = ((e.pageY - box.top) / box.height)

			this.translate = [left * (1 / this.scale), top * (1 / this.scale)] */
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
</style>
