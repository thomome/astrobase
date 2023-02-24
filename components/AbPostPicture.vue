<template>
	<div class="picture relative mb-5 md:mb-8 lg:mb-12 block lg:flex">
		<div class="picture__image-container w-full">
			<nuxt-link
				:to="`/pictures/${picture.id}`"
				:aria-label="picture.title"
			>
				<ab-image
					:image="image"
					:sizes="sizes"
					class="picture__image w-full"
				/>
			</nuxt-link>
		</div>
		<div class="picture__details flex-shrink-0 xl:w-1/4 lg:w-1/3 lg:ml-8 mt-1 lg:mt-0">
			<h2 class="picture__title md:text-3xl text-2xl leading-tight font-semibold text-gray-200 lg:mt-0">
				<nuxt-link
					:to="`/pictures/${picture.id}`"
				>
					{{ picture.title }}
				</nuxt-link>
			</h2>

			<div class="picture__date-location text-gray-700 text-sm leading-relaxed">
				{{ picture.date }} <span v-if="picture.location[0]"> - {{ picture.location[0].title }}</span>
			</div>

			<div class="picture__column-container hidden lg:block">
				<ab-object-list :objects="picture.objects" :number="0" title="Objects in Frame" />
			</div>

			<div class="picture__column-container hidden lg:block">
				<ab-exposure-time :exposures="picture.exposures" :compact="false" title="Exposures" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Picture } from '~~/types';

interface Props {
	picture: Picture;
	sizes?: string;
}

const props = withDefaults(defineProps<Props>(), {
	sizes: '100vw'
});

const image = computed(() => {
	return props.picture.image[0];
});
</script>
