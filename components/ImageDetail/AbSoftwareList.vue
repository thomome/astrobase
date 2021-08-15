<template>
	<div
		v-if="software.length"
		class="software-list mt-6"
	>
		<h3 v-if="title" class="picture__details-title section-title">
			{{ title }}
		</h3>
		<ul class="picture__details-list text-sm border-l border-yellow-400 pl-4 mb-2 ml-1">
			<li
				v-for="prog in software"
				:key="prog.id"
			>
				{{ prog.title }}
			</li>
		</ul>
	</div>
</template>

<script>
export default {
	props: {
		title: { type: String, default: '' },
		software: { type: Array, default: () => [] }
	}
}
</script>

<style>

</style>
