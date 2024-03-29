<template>
	<div class="filter">
		<label
			v-if="label"
			:for="`filters-${paramsKey}`"
			class="block section-title mb-1"
		>{{ label }}</label>
		<multiselect
			v-if="async"
			:id="`filters-${paramsKey}`"
			v-model="preparedValue"
			:options="preparedOptions"
			:multiple="multiple"
			:loading="isLoading"
			:searchable="true"
			:internal-search="false"
			:show-labels="false"
			:hide-selected="true"
			:allow-empty="allowEmpty"
			:label="labelKey"
			track-by="id"
			@search-change="fetch"
			@input="onInput"
		>
			<template #afterList>
				<ab-loading
					v-if="total > preparedOptions.length"
					v-observe-visibility="reachedEndOfList"
					class="mx-auto pt-2 pb-4 text-xs"
				/>
			</template>
		</multiselect>

		<multiselect
			v-if="!async"
			:id="`filter-${paramsKey}`"
			v-model="preparedValue"
			:options="options"
			:show-labels="false"
			:label="labelKey"
			:allow-empty="allowEmpty"
			:multiple="multiple"
			track-by="id"
			@input="onInput"
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
		label: { type: String, default: '' },
		labelKey: { type: String, default: 'name' },
		paramsKey: { type: String, required: true },
		getItems: { type: Function, default: () => {} },
		getItem: { type: Function, default: () => {} },
		onChange: { type: Function, default: () => {} },
		options: { type: Array, default: () => [] },
		multiple: { type: Boolean, default: false },
		allowEmpty: { type: Boolean, default: true }
	},
	data () {
		return {
			preparedValue: [],
			isLoading: false,
			preparedOptions: [],
			limit: 10,
			offset: 0,
			query: '',
			total: 0
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
		reachedEndOfList (reached) {
			if (reached) {
				this.fetchMore()
			}
		},
		onInput () {
			this.onChange(this.paramsKey, this.preparedValue)
		},
		async fetchMore () {
			this.offset += this.limit
			const { limit, query, offset } = this
			this.isLoading = true
			const q = await this.getItems({ query, limit, offset })
			this.preparedOptions.push(...q.results)
			this.total = q.total
			this.setCache(q.results)
			this.isLoading = false
		},
		async fetch (newQuery = '') {
			this.query = newQuery
			this.offset = 0
			const { limit, query } = this

			this.isLoading = true
			const q = await this.getItems({ query, limit })
			this.preparedOptions = q.results
			this.total = q.total
			this.setCache(q.results)
			this.isLoading = false
		},
		setCache (results) {
			const cache = sessionStorage.getItem(`${this.paramsKey}-results`)
			const items = cache ? JSON.parse(cache) : {}
			results.forEach((r) => {
				items[r.id] = r
			})
			sessionStorage.setItem(`${this.paramsKey}-results`, JSON.stringify(items))
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
			} else if (this.multiple) {
				const keys = this.options.map(opt => opt.id)
				const values = this.values.map((id) => {
					const index = keys.indexOf(id)
					return { ...this.options[index] }
				})
				this.preparedValue = values
			} else {
				const value = { id: this.value }
				this.options.forEach((opt) => {
					if (opt.id === value.id) {
						value[this.labelKey] = opt[this.labelKey]
					}
				})
				this.preparedValue = value
			}
		},
		async getItemFromCache (id) {
			const cache = sessionStorage.getItem(`${this.paramsKey}-results`)
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
		@apply bg-transparent text-sm;
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

	.filter .multiselect__content {
		@apply overflow-hidden w-full;
	}

	.filter .multiselect__content-wrapper {
		@apply bg-gray-900 text-sm border-gray-700;
	}

	.filter .multiselect__option {
		@apply truncate;
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
