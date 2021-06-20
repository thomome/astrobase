<template>
	<div
		v-if="objects.length"
		class="picture__tags max-w-6xl font-light text-sm"
	>
		<h3 v-if="title" class="picture__details-title section-title">
			{{ title }}
		</h3>
		<div>
			<ab-object-link
				v-for="obj in shownObjects"
				:key="obj.id"
				:obj="obj"
			/>

			<span
				v-if="objects.length > shownObjects.length"
				class="cursor-pointer py-2"
				@click="toggleAll"
			>
				...
			</span>
		</div>
	</div>
</template>

<script>
import AbObjectLink from '../AbObjectLink.vue'

export default {
	components: { AbObjectLink },
	props: {
		title: { type: String, default: '' },
		objects: { type: Array, default: () => [] },
		showAll: { type: Boolean, default: true }
	},
	data () {
		return {
			shwoAllObjects: this.showAll
		}
	},
	computed: {
		shownObjects () {
			const { shwoAllObjects, objects } = this

			const limit = shwoAllObjects ? Infinity : 6
			return objects.filter((obj, i) => i < limit)
		}
	},
	methods: {
		toggleAll () {
			this.shwoAllObjects = true
		}
	}
}
</script>

<style lang="scss" scoped>

</style>
