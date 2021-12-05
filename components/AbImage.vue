<template>
	<img
		:src="loaded ? url : image.sizes.small"
		:srcset="loaded ? srcset : ''"
		:sizes="loaded ? sizes : ''"
		:alt="alt"
		:style="{'aspect-ratio': `${image.width} / ${image.height}`}"
		class="block w-full"
	>
</template>

<script>
export default {
	props: {
		alt: { type: String, default: '' },
		image: { type: Object, required: true },
		minSize: { type: String, default: 'small' },
		full: { type: Boolean, default: false }
	},
	data () {
		return {
			defaultSizes: ['small', 'medium', 'medium_large', 'large', 'extra_large'],
			loaded: false
		}
	},
	computed: {
		url () {
			const { image, full } = this
			return full ? image.original : image.url
		},
		srcset () {
			const { image, defaultSizes, full } = this
			const srcsetArray = defaultSizes.map(size => `${image.sizes[size]} ${image.sizes[`${size}-width`]}w`)
			return full ? '' : srcsetArray.join(', ')
		},
		sizes () {
			const { image, defaultSizes, minSize, full } = this
			const size = defaultSizes.includes(minSize) ? minSize : defaultSizes[0]
			return full ? '' : `(max-width: ${image.sizes[`${size}-width`]}px) ${image.sizes[`${size}-width`]}px`
		}
	},
	mounted () {
		const img = document.createElement('img')
		img.addEventListener('load', () => {
			this.loaded = true
		})
		img.sizes = this.sizes
		img.alt = this.alt
		img.src = this.url
		img.srcset = this.srcset
	}
}
</script>

<style>

</style>
