<template>
	<img
		:src="image.url"
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
		minSize: { type: String, default: 'small' }
	},
	data () {
		return {
			defaultSizes: ['small', 'medium', 'medium_large', 'large', 'extra_large']
		}
	},
	computed: {
		srcset () {
			const { image, defaultSizes } = this
			const srcsetArray = defaultSizes.map(size => `${image.sizes[size]} ${image.sizes[`${size}-width`]}w`)
			return srcsetArray.join(', ')
		},
		sizes () {
			const { image, defaultSizes, minSize } = this
			const size = defaultSizes.includes(minSize) ? minSize : defaultSizes[0]
			return `(max-width: ${image.sizes[`${size}-width`]}px) ${image.sizes[`${size}-width`]}px`
		}
	}
}
</script>

<style>

</style>
