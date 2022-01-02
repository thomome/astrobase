<template>
	<div class="picture relative block">
		<div class="picture__image-container w-full h-full">
			<nuxt-link
				:to="`/pictures/${picture.id}`"
				:aria-label="picture.title"
			>
				<ab-image
					:image="image"
					:sizes="sizes"
					class="picture__image w-full h-full object-cover"
				/>
				<div class="picture__info absolute w-full text-gray-200 bottom-0 left-0 px-3 pb-2 pt-20 bg-gradient-to-t from-black to-transparent">
					<h4 class="font-medium text-gray-200 leading-tight text-lg">
						{{ picture.title }}
					</h4>
					<div class="text-gray-500 text-sm leading-relaxed">
						{{ picture.date }}
					</div>
				</div>
			</nuxt-link>
		</div>
	</div>
</template>

<script>
import AbImage from '~/components/AbImage.vue'

export default {
	components: { AbImage },
	props: {
		picture: { type: Object, required: true },
		sizes: { type: String, default: '100vw' }
	},
	computed: {
		image () {
			return this.picture.image[0]
		}
	}
}
</script>

<style lang="scss" scoped>
	.picture {
		.picture__info {
			opacity: 0;
			transition: opacity 0.25s;

			* {
				transform: translateY(-10px);
				transition: transform 0.25s;
			}
		}

		&:hover {
			.picture__info {
				opacity: 1;

				* {
					transform: translateY(0);
				}
			}
		}
	}
</style>
