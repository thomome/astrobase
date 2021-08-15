<template>
	<div class="picture relative block">
		<div class="picture__image-container w-full h-full">
			<nuxt-link
				:to="`/pictures/${picture.id}`"
				:aria-label="picture.title"
			>
				<ab-image
					:image="image"
					class="picture__image w-full h-full object-cover"
				/>
			</nuxt-link>
		</div>
	</div>
</template>

<script>
import AbImage from '~/components/AbImage.vue'

export default {
	components: { AbImage },
	props: {
		picture: { type: Object, required: true }
	},
	computed: {
		image () {
			return this.picture.image[0]
		}
	}
}
</script>
