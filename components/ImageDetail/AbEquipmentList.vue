<template>
	<div
		v-if="equipment.length"
		class="equipment mr-16 font-light text-sm"
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

<script>
export default {
	props: {
		title: { type: String, default: '' },
		equipment: { type: Array, default: () => [] }
	}
}
</script>

<style>

</style>
