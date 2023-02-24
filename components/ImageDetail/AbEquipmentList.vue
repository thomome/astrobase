<template>
	<div
		v-if="equipment.length"
		class="equipment mr-16 font-light text-sm mt-6"
	>
		<h3 v-if="title" class="picture__details-title section-title">
			{{ title }}
		</h3>
		<div>
			<nuxt-link
				v-for="device in equipment"
				:key="device.id"
				:to="{ path: '/pictures', query: { devices: [device.id] } }"
				class="object-link"
			>
				{{ device.title }}
			</nuxt-link>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Device } from '~~/types';

interface Props {
	title: string;
	equipment: Device[];
}

const props = withDefaults(defineProps<Props>(), {
	title: '',
	equipment: () => []
});
</script>

<style>

</style>
