<template>
	<div
		v-if="exposures.length"
		class="exposure-time"
	>
		<h3 v-if="title" class="ab-exposure-time__title section-title">
			{{ title }}
		</h3>
		<ul class="exposure-time__list">
			<li
				v-for="exposure in exposures"
				:key="exposure.exposure_time + exposure.mode"
				class="flex items-center"
			>
				<span class="mr-1 text-sm">
					{{ exposure.amount }} x {{ exposure.exposure_time }}&#8239;<small>s</small>
				</span>
				<ab-tag
					v-if="exposure.gain"
					:label="exposure.gain"
					class="sm outline"
				/>
				<ab-tag
					:label="exposure.mode.label"
					:type="exposure.mode.value"
					class="sm"
				/>
			</li>
		</ul>
		<div class="-ml-px">
			<span class="text-yellow-400 mr-2">∑</span>
			<span v-html="totalExposureTime" class="text-sm" />
		</div>
	</div>
</template>

<script>
import moment from 'moment'
import AbTag from '../AbTag.vue'

export default {
	components: { AbTag },
	props: {
		exposures: { type: Array, default: () => [] },
		title: { type: String, default: '' }
	},
	computed: {
		totalExposureTime () {
			const secs = this.exposures.reduce((p, v) => {
				return p + v.exposure_time * v.amount
			}, 0)

			const duration = moment.duration(secs * 1000)
			const hours = duration.hours()
			const minutes = duration.minutes()
			const seconds = duration.seconds()

			let durationString = ''
			if (hours) { durationString += `${hours}&#8239;<small>h</small> ` }
			if (minutes) { durationString += `${minutes}&#8239;<small>min</small> ` }
			if (seconds) { durationString += `${seconds}&#8239;<small>s</small>` }

			return durationString
		}
	}
}
</script>

<style lang="scss" scoped>
	.exposure-time__list {
		@apply border-l border-yellow-400 pl-4 my-2 ml-1;
	}
</style>
