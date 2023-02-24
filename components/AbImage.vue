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

<script setup lang="ts">
import { Image } from '~~/types';

interface Props {
	alt?: string;
	image: Image;
	sizes?: string;
	full?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	alt: '',
	sizes: '100vw',
	full: false
});

const defaultSizes = ['small', 'medium', 'medium_large', 'large', 'extra_large'];
const loaded = ref(false);

const url = computed(() => {
	return props.full ? props.image.original : props.image.url;
});

const srcset = computed(() => {
	const srcsetArray = defaultSizes
		.map(size => `${props.image.sizes[size]} ${props.image.sizes[`${size}-width`]}w`);
	return props.full ? '' : srcsetArray.join(', ');
});

watch(props.image, (image) => {
	preload();
})

onMounted(() => {
	preload();
})

const preload = () => {
	loaded.value = false;
	const img = document.createElement('img');
	img.addEventListener('load', () => {
		loaded.value = true;
	})
	img.sizes = props.sizes;
	img.alt = props.alt;
	img.src = url.value;
	img.srcset = srcset.value;
}
</script>

<style lang="scss" scoped>
</style>
