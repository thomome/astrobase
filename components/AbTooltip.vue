<template>
	<div
		v-if="active"
		:style="`transform: translate(${x}px, ${y}px)`"
		class="tooltip"
	>
		<div
			ref="tooltip"
			class="tooltip__container"
		>
			<div
				v-for="(link, index) in links"
				:key="index"
				:class="['tooltip__link']"
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
	</div>
</template>
<script>
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
			this.y = rect.y + scrollY + rect.height
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
.tooltip {
	@apply absolute flex left-0 top-0 mt-2 shadow-md;
	z-index: 10000;

	&::before {
		@apply absolute block left-0 top-0 w-3 h-3 bg-yellow-400 -mt-1 ml-2;
		content: '';
		transform: rotate(45deg);
	}

	@media screen and (max-width: theme('screens.md')) {
		@apply fixed w-full h-full items-center justify-center bg-black bg-opacity-50;
		transform: translate(0, 0) !important;

		&::before {
			@apply hidden;
		}
	}
}

.tooltip__container {
	@apply bg-yellow-400 text-sm text-gray-900 py-1 shadow-lg;
}

.tooltip__link {
	@apply py-1 px-2;

	@media screen and (max-width: theme('screens.md')) {
		@apply py-2 px-4;
	}
}

</style>
