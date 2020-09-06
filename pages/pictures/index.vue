<template>
	<main class="main-content">
		<div class="picture-list container mt-24 md:mt-40">
			<div class="sort flex items-end mb-4">
				<ab-select
					:on-change="updateParams"
					:value="params.orderby"
					:options="sortOptions"
					:allowEmpty="false"
					label="Sort"
					params-key="orderby"
					class="w-full md:max-w-xs mr-4"
				/>
				<button
					@click="filtersOpen = !filtersOpen"
					:class="`filter-toggle md:hidden mt-2 ml-auto border rounded-sm ${filtersOpen ? 'border-white text-white' : 'border-gray-700'}`"
				>
					<ab-icon name="tune" />
				</button>
			</div>
			<div :class="`filters md:grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8 ${filtersOpen || params.objects.length > 0 || params.devices.length > 0 || params.locations.length > 0 ? 'grid': 'hidden'}`">
				<ab-select
					:on-change="updateParams"
					:values="params.objects"
					:get-items="getObjects"
					:get-item="getObject"
					:multiple="true"
					async
					label="Objects"
					params-key="objects"
					label-key="long_name"
					class="w-full mb-1"
				/>
				<ab-select
					:on-change="updateParams"
					:values="params.devices"
					:get-items="getDevices"
					:get-item="getDevice"
					:multiple="true"
					async
					label="Devices"
					params-key="devices"
					label-key="title"
					class="w-full mb-1"
				/>
				<ab-select
					:on-change="updateParams"
					:values="params.locations"
					:get-items="getLocations"
					:get-item="getLocation"
					:multiple="true"
					async
					label="Locations"
					params-key="locations"
					label-key="title"
					class="w-full mb-1"
				/>
			</div>
			<ab-post-picture
				v-for="picture in pictures"
				:key="picture.id"
				:picture="picture"
			/>
			<div
				v-if="pictures.length === 0 && !isLoading"
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
				v-if="isLoading"
				class="mx-auto mt-12 mb-24"
			/>
		</div>
	</main>
</template>

<script>
import { getPictures, getObjects, getObject, getDevices, getDevice, getLocations, getLocation } from '~/api/api.js'

import AbSelect from '~/components/AbSelect.vue'
import AbPostPicture from '~/components/AbPostPicture.vue'
import AbLoading from '~/components/AbLoading.vue'
import AbIcon from '~/components/AbIcon.vue'

const config = {
	perPage: 6
}

export default {
	components: { AbPostPicture, AbSelect, AbLoading, AbIcon },
	watchQuery: ['objects', 'devices', 'locations', 'orderby'],
	data () {
		return {
			sortOptions: [
				{ id: 'latest', name: 'Latest' },
				{ id: 'oldest', name: 'Oldest' },
				{ id: 'title', name: 'Title' },
				{ id: 'stats', name: 'Statistical Rating' }
			],
			isLoading: true,
			filtersOpen: false
		}
	},
	async asyncData ({ query, app }) {
		const params = {
			objects: [],
			devices: [],
			locations: [],
			limit: config.perPage,
			offset: 0,
			orderby: 'latest'
		}
		for (const key in query) {
			if (key === 'orderby') {
				params[key] = query[key]
			} else {
				params[key] = Array.isArray(query[key]) ? query[key] : [parseInt(query[key])]
			}
		}

		const pictures = await getPictures(params)

		const meta = {
			title: `Pictures - ${app.head.title}`
		}

		return {
			meta,
			pictures: pictures.results,
			total: pictures.total,
			isLoading: false,
			params
		}
	},
	head () {
		return this.meta
	},
	mounted () {
		window.addEventListener('scroll', () => {
			if (!this.isLoading && this.params.offset + config.perPage < this.total && this.getScrollPosition() > 0.6) {
				this.params.offset += config.perPage
				this.fetch()
			}
		})
	},
	methods: {
		async fetch () {
			this.isLoading = true
			const pictures = await getPictures(this.params)
			this.pictures.push(...pictures.results)
			this.isLoading = false
		},
		getScrollPosition () {
			const h = document.documentElement
			const b = document.body
			const st = 'scrollTop'
			const sh = 'scrollHeight'
			return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)
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
		getLocation
	}
}
</script>

<style lang="scss" scoped>
	.filter-toggle {
		padding: 6px 12px;
		font-size: 1.1rem;
	}
</style>
