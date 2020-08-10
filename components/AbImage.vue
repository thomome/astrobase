<template>
	<img
		:src="url"
		:srcset="srcset"
		:sizes="sizes"
		:alt="alt"
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
			defaultSizes: ['small', 'medium', 'medium_large', 'large', 'extra_large']
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
	}
}
</script>

<style>

</style>
