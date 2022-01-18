<template>
	<div
		ref="grid"
		class="ab-masonry-grid"
		:style="{ margin: `${gridGap / -2 }px` }"
	>
		<ab-gallery-picture
			v-for="(picture, i) in pictures"
			:key="picture.id"
			:picture="picture"
			:style="{ width: `calc(${sizes[i].width}% - ${gridGap}px)`, height: `calc(${sizes[i].height || rowHeight}px - ${gridGap}px)`, margin: `${gridGap / 2}px` }"
			:class="{ active: gridWidth }"
			sizes="700px"
		/>
	</div>
</template>

<script>
import AbGalleryPicture from './AbGalleryPicture.vue'
let resizeTimeout = null

export default {
	components: { AbGalleryPicture },
	props: {
		pictures: { type: Array, default: () => [] },
		rowHeight: { type: Number, default: 340 },
		gridGap: { type: Number, default: 16 }
	},
	data () {
		return {
			gridWidth: 0
		}
	},
	computed: {
		sizes () {
			const { rowHeight, gridWidth } = this

			let rowWidth = 0
			let rowItems = []
			const sizes = []

			this.pictures.forEach((item, index) => {
				const img = item.image[0]
				const w = rowHeight / img.height * img.width
				if (rowWidth + w > gridWidth + w / 2) {
					const rH = gridWidth / rowWidth * rowHeight
					rowItems.forEach((rItem) => {
						sizes.push({
							width: 100 / gridWidth * rH / rItem.height * rItem.width,
							height: Math.floor(rH)
						})
					})
					rowWidth = 0
					rowItems = []
				}
				rowWidth += w
				rowItems.push(img)

				if (index >= this.pictures.length - 1) {
					const rH = gridWidth - rowWidth < gridWidth / 3 ? gridWidth / rowWidth * rowHeight : rowHeight
					rowItems.forEach((rItem) => {
						sizes.push({
							width: 100 / gridWidth * rH / rItem.height * rItem.width,
							height: Math.floor(rH)
						})
					})
					rowWidth = 0
					rowItems = []
				}
			})

			return sizes
		}
	},
	mounted () {
		window.addEventListener('resize', this.onResize)
		this.onResize()
	},
	destroyed () {
		window.removeEventListener('resize', this.onResize)
	},
	methods: {
		onResize () {
			if (resizeTimeout) {
				clearTimeout(resizeTimeout)
			}
			resizeTimeout = setTimeout(() => {
				this.gridWidth = this.$refs.grid.clientWidth
				resizeTimeout = null
			}, 200)
		}
	}
}
</script>

<style lang="scss" scoped>
	.ab-masonry-grid {
		display: flex;
		flex-wrap: wrap;

		&::after {
			content: '';
			flex-grow: 1000000000;
		}
	}

	.picture {
		margin: 5px;
		height: 400px;
		flex-grow: 1;
		opacity: 0;

		&.active {
			opacity: 1;
		}
	}
</style>
