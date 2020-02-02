<template>
	<div class="filter">
		<label
			:for="`filter-${paramsKey}`"
			class="block text-gray-700 text-sm uppercase font-medium mb-1"
		>{{ label }}</label>
		<multiselect
			v-if="async"
			v-model="preparedValue"
			:options="preparedOptions"
			:multiple="true"
			:loading="isLoading"
			:searchable="true"
			:showLabels="false"
			:hideSelected="true"
			:label="labelKey"
			:id="`filter-${paramsKey}`"
			@search-change="fetch"
			@input="onInput"
			track-by="id"
		/>

		<multiselect
			v-if="!async"
			v-model="preparedValue"
			:options="options"
			:showLabels="false"
			:label="labelKey"
			:allowEmpty="false"
			:id="`filter-${paramsKey}`"
			@input="onInput"
			track-by="id"
		/>
	</div>
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
	components: { Multiselect },
	props: {
		async: { type: Boolean, default: false },
		value: { type: String, default: '' },
		values: { type: Array, default: () => [] },
		label: { type: String, default: 'Filter' },
		labelKey: { type: String, default: 'name' },
		paramsKey: { type: String, required: true },
		getItems: { type: Function, default: () => {} },
		getItem: { type: Function, default: () => {} },
		onChange: { type: Function, default: () => {} },
		options: { type: Array, default: () => [] }
	},
	data () {
		return {
			preparedValue: [],
			isLoading: false,
			preparedOptions: []
		}
	},
	watch: {
		value () {
			this.fillMissing()
		},
		values () {
			this.fillMissing()
		}
	},
	mounted () {
		if (this.async) {
			this.fetch()
		}
		this.fillMissing()
	},
	methods: {
		onInput () {
			this.onChange(this.paramsKey, this.preparedValue)
		},
		async fetch (query = false) {
			this.isLoading = true
			const q = await this.getItems(query)
			this.preparedOptions = q.results
			this.setCache(q.results)
			this.isLoading = false
		},
		setCache (results) {
			const cache = sessionStorage.getItem(`${this.queryKey}-results`)
			const items = cache ? JSON.parse(cache) : {}
			results.forEach((r) => {
				items[r.id] = r
			})
			sessionStorage.setItem(`${this.queryKey}-results`, JSON.stringify(items))
		},
		fillMissing () {
			if (this.async) {
				this.preparedValue.forEach((v, i) => {
					if (!this.values.includes(v.id)) {
						this.$delete(this.preparedValue, i)
					}
				})
				this.values.forEach(async (v, i) => {
					if (!this.preparedValue.includes(v)) {
						const item = await this.getItemFromCache(v)
						this.$set(this.preparedValue, i, item)
					}
				})
			} else {
				const value = { id: this.value }
				this.options.forEach((opt) => {
					if (opt.id === value.id) {
						value.name = opt.name
					}
				})
				this.preparedValue = value
			}
		},
		async getItemFromCache (id) {
			const cache = sessionStorage.getItem(`${this.queryKey}-results`)
			const items = cache ? JSON.parse(cache) : {}
			if (items[id]) {
				return items[id]
			}

			const q = await this.getItem(id)
			if (q.result) {
				return q.result
			}

			return {
				id,
				[this.labelKey]: 'unknown',
				slug: 'unknown'
			}
		}
	}
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
	.filter .multiselect {
		@apply text-gray-400;
	}

	.filter .multiselect--active {
		@apply z-10;

		.multiselect__tags {
			@apply border-gray-700;
		}
	}

	.filter .multiselect__single {
		@apply bg-transparent;
	}

	.filter .multiselect__placeholder {
		@apply pt-0 mb-0;
	}

	.filter .multiselect__tags {
		@apply bg-gray-900 rounded-sm border-gray-700 text-sm;
	}

	.filter .multiselect__spinner {
		@apply bg-transparent mr-5;

		&::after,
		&::before {
			border-top-color: theme('colors.yellow.400');
		}
	}

	.filter .multiselect__input {
		@apply bg-transparent text-sm pl-0;
	}

	.filter .multiselect__content-wrapper {
		@apply bg-gray-900 text-sm border-gray-700;
	}

	.filter .multiselect__option--highlight {
		@apply bg-yellow-400 text-black;
	}

	.filter .multiselect__option--selected {
		@apply bg-white text-black font-normal;
	}

	.filter .multiselect__tag {
		@apply bg-yellow-400 text-black rounded-sm;
	}

	.filter .multiselect__tag-icon {
		@apply rounded-none;

		&:hover {
			@apply text-black;
			background: transparentize(black, 0.8);
		}

		&::after {
			@apply text-black;
			content: "\2715";
			font-size: 0.625rem;
			vertical-align: middle;
		}
	}
</style>