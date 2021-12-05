<template>
	<div
		v-if="objects.length"
		class="picture__tags max-w-6xl font-light text-sm mt-6"
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
		number: { type: Number, default: 0 }
	},
	data () {
		return {
			showAllObjects: false
		}
	},
	computed: {
		shownObjects () {
			const { showAllObjects, number, objects } = this

			const limit = number === 0 || showAllObjects ? Infinity : number
			return objects.filter((obj, i) => i < limit)
		}
	},
	methods: {
		toggleAll () {
			this.showAllObjects = true
		}
	}
}
</script>

<style lang="scss" scoped>

</style>
