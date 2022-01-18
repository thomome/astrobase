<template>
	<main class="main-content">
		<div class="picture-list container mt-24 md:mt-40">
			<div class="picture-list-grid">
				<h1 class="picture-list__title text-4xl md:text-5xl text-gray-200 tracking-wide font-semibold md:mb-4">
					Pictures
				</h1>
				<div class="picture-list__filters">
					<div class="flex items-end">
						<ab-select
							:on-change="updateParams"
							:value="orderBy"
							:options="sortOptions"
							:allow-empty="false"
							label="Sort by"
							params-key="orderby"
							class="w-full md:mr-0 mr-4 max-w-sm"
						/>
						<div class="flex border border-gray-700 mt-2 ml-auto md:ml-3 rounded-sm">
							<button
								class="filter-toggle border-r border-gray-700"
								:class="{'text-yellow-400': displayMode === 'grid' }"
								@click="setDisplayMode('grid')"
							>
								<ab-icon name="grid-view" />
							</button>
							<button
								class="filter-toggle gray-700"
								:class="{'text-yellow-400': displayMode === 'list' }"
								@click="setDisplayMode('list')"
							>
								<ab-icon name="list-view" />
							</button>
						</div>
						<button
							:class="`filter-toggle md:hidden mt-2 ml-3 border rounded-sm ${filtersOpen ? 'border-white text-white' : 'border-gray-700'}`"
							@click="filtersOpen = !filtersOpen"
						>
							<ab-icon name="tune" />
						</button>
					</div>
					<div :class="`md:grid 2xl:grid-cols-1 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mb-4 mt-4 ${filtersOpen || filterObjects.length > 0 || filterDevices.length > 0 || filterLocations.length > 0 ? 'grid': 'hidden'}`">
						<ab-select
							:on-change="updateParams"
							:values="filterObjects"
							:get-items="getObjects"
							:get-item="getObject"
							:multiple="true"
							async
							label="Objects in Frame"
							params-key="objects"
							label-key="long_name"
							class="w-full"
						/>
						<ab-select
							:on-change="updateParams"
							:values="filterDevices"
							:get-items="getDevices"
							:get-item="getDevice"
							:multiple="true"
							async
							label="Devices used"
							params-key="devices"
							label-key="title"
							class="w-full"
						/>
						<ab-select
							:on-change="updateParams"
							:values="filterLocations"
							:get-items="getLocations"
							:get-item="getLocation"
							:multiple="true"
							async
							label="Taken From"
							params-key="locations"
							label-key="title"
							class="w-full"
						/>
					</div>
				</div>
				<div class="picture-list__list">
					<ab-masonry-grid
						v-if="displayMode === 'grid'"
						:pictures="results"
					/>
					<div v-else>
						<ab-post-picture
							v-for="picture in results"
							:key="picture.id"
							:picture="picture"
							:sizes="`(max-width: ${bp['lg']}) 100vw, (max-width: ${bp['2xl']}) 65vw, min(50vw, 1200px)`"
						/>
					</div>
					<div
						v-if="results.length === 0 && !isLoading"
						class="flex flex-col items-center mt-12 mb-24"
					>
						<p>
							No pictures found for your filter settings.
						</p>
						<nuxt-link
							to="/pictures"
							class="button mt-6"
						>
							Reset Filters
						</nuxt-link>
					</div>
					<ab-loading
						v-if="total > results.length"
						v-observe-visibility="reachedEndOfList"
						class="mx-auto text-3xl mt-12 mb-24"
					/>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import twConfig from '~/tailwind.config'
import { getObjects, getObject, getDevices, getDevice, getLocations, getLocation } from '~/api/api.js'

import AbSelect from '~/components/AbSelect.vue'
import AbPostPicture from '~/components/AbPostPicture.vue'
import AbLoading from '~/components/AbLoading.vue'
import AbIcon from '~/components/AbIcon.vue'
import AbMasonryGrid from '~/components/AbMasonryGrid.vue'

export default {
	components: { AbPostPicture, AbSelect, AbLoading, AbIcon, AbMasonryGrid },
	async asyncData ({ query, app, store }) {
		const params = {
			objects: [],
			devices: [],
			locations: [],
			orderby: 'latest'
		}
		for (const key in query) {
			if (key === 'orderby') {
				params[key] = query[key]
			} else {
				params[key] = Array.isArray(query[key]) ? query[key] : [parseInt(query[key])]
			}
		}

		await store.dispatch('pictures/load', params)

		const locationIndex = {}
		const locations = []
		const objectIndex = {}
		const objects = []
		store.getters['pictures/results'].forEach((pic) => {
			const loc = pic.location[0] ? pic.location[0] : null
			if (loc && !locationIndex[loc.id]) {
				locationIndex[loc.id] = true
				locations.push(loc)
			}
			const obj = pic.objects[0] ? pic.objects[0] : null
			if (obj && !objectIndex[obj.id]) {
				objectIndex[obj.id] = true
				objects.push(obj)
			}
		})
		const objectString = objects.map(obj => obj.long_name).join(', ')
		const locationString = locations.map(loc => loc.title).join(', ')
		const description = `Astrophotography images taken in ${locationString} of ${objectString}.`

		const meta = {
			title: `Pictures - ${app.head.title}`,
			meta: [
				{ hid: 'description', name: 'description', content: description },
				{ property: 'og:type', content: 'website' },
				{ property: 'og:title', content: 'Pictures' },
				{ property: 'og:description', content: description }
			]
		}

		return {
			meta
		}
	},
	data () {
		return {
			sortOptions: [
				{ id: 'latest', name: 'Last Taken' },
				{ id: 'processed', name: 'Last Processed' },
				{ id: 'oldest', name: 'Oldest' }
			],
			isLoading: false,
			filtersOpen: false
		}
	},
	head () {
		return this.meta
	},
	computed: {
		...mapGetters('pictures', [
			'total',
			'offset',
			'limit',
			'results',
			'orderBy',
			'filterObjects',
			'filterLocations',
			'filterDevices',
			'displayMode'
		]),
		bp () {
			return twConfig.theme.screens
		}
	},
	watchQuery: ['objects', 'devices', 'locations', 'orderby'],
	methods: {
		reachedEndOfList (reached) {
			if (reached) {
				this.fetchMore()
			}
		},
		async fetchMore () {
			if (!this.isLoading && this.offset + this.limit < this.total) {
				this.isLoading = true
				await this.$store.dispatch('pictures/loadMore')
				this.isLoading = false
			}
		},
		updateParams (key, value) {
			const route = this.$router.currentRoute
			const query = Object.assign({}, route.query)
			query[key] = Array.isArray(value) ? value.map(v => v.id) : value.id
			this.$router.push({
				path: route.path,
				query
			})
		},
		getObjects,
		getObject,
		getDevices,
		getDevice,
		getLocations,
		getLocation,
		...mapMutations({
			setDisplayMode: 'pictures/setDisplayMode'
		})
	}
}
</script>

<style lang="scss" scoped>
	.picture-list-grid {
		display: grid;
		grid-template-areas: "title title" "sidebar sidebar" "list list";
		grid-template-columns: min(350px, 70vw) auto;
		grid-template-rows: auto auto auto;
		gap: 24px;

		@screen 2xl {
			grid-template-areas: "title title" "sidebar list" "sidebar list";
		}
	}

	.picture-list__filters {
		grid-area: sidebar;
	}

	.picture-list__list {
		grid-area: list;
	}

	.picture-list__title {
		grid-area: title;
	}

	.filter-toggle {
		padding: 6px 12px;
		font-size: 1.1rem;
	}
</style>
