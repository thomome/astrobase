<template>
	<div
		ref="tooltip"
		v-if="active"
		:style="`transform: translate(${x}px, ${y}px)`"
		class="ab-tooltip"
	>
		<div
			v-for="(link, index) in links"
			:key="index"
			:class="['ab-tooltip__link']"
		>
			<nuxt-link v-if="!link.external" :to="link.url" class="border-b border-transparent hover:border-black">
				{{ link.text }}
			</nuxt-link>
			<a v-if="link.external" :href="link.url" target="_blank" class="border-b border-transparent hover:border-black">
				{{ link.text }}
				<ab-icon name="external-link" />
			</a>
		</div>
	</div>
</template>
<script>
import AbIcon from './AbIcon.vue'
import { EventBus } from '~/plugins/EventBus'

export default {
	components: { AbIcon },
	data: () => {
		return {
			active: false,
			target: null,
			trigger: null,
			x: 0,
			y: 0,
			links: []
		}
	},
	mounted () {
		EventBus.$on('show-tooltip', (data) => {
			this.active = true
			this.target = data.target
			this.trigger = data.trigger
			this.links = data.links
			this.updatePosition()
		})

		window.addEventListener('click', (e) => {
			if (
				this.active &&
				this.trigger !== e.target && !this.trigger.contains(e.target) &&
				e.target !== this.$refs.tooltip
			) {
				this.clear()
			}
		})

		window.addEventListener('scroll', (e) => {
			if (this.active) {
				this.clear()
			}
		})

		window.addEventListener('resize', (e) => {
			if (this.active) {
				this.updatePosition()
			}
		})
	},
	methods: {
		updatePosition () {
			const rect = this.target.getBoundingClientRect()
			this.x = rect.x
			this.y = rect.y + pageYOffset + rect.height
		},
		clear () {
			this.active = false
			this.target = null
			this.trigger = null
			this.links = []
			this.x = 0
			this.y = 0
		}
	}
}
</script>
<style lang="scss" scoped>
.ab-tooltip {
	@apply absolute left-0 top-0 bg-yellow-400 text-sm text-gray-900 py-1 mt-2 shadow-lg;

	&::before {
		@apply absolute block left-0 top-0 w-3 h-3 bg-yellow-400 -mt-1 ml-2;
		content: '';
		transform: rotate(45deg);
	}

	@media screen and (max-width: theme('screens.md')) {
		@apply absolute;
		transform: translate(-50%, -50%) !important;
		left: 50%;
		top: 50%;

		&::before {
			@apply hidden;
		}
	}
}

.ab-tooltip__link {
	@apply py-1 px-2;
}

</style>
