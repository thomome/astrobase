<template>
	<div ref="picture" class="astro-picture relative w-full h-full overflow-hidden">
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
		}
	},
	mounted () {
		this.resizeObserver = new ResizeObserver(() => {
			this.container = {
				width: this.$refs.picture.clientWidth,
				height: this.$refs.picture.clientHeight
			}
		})
		this.resizeObserver.observe(this.$refs.picture)
	},
	destroyed () {
		this.resizeObserver.disconnect()
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
