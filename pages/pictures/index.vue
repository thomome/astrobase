<template>
	<main class="main-content">
		<div class="picture-list container mt-48">
			<div class="sort">
				<ab-select
					:on-change="updateParams"
					:value="params.orderby"
					:options="sortOptions"
					label="Sort"
					params-key="orderby"
					class="w-full max-w-xs mr-6 mb-4"
				/>
			</div>
			<div class="filters flex flex-wrap pb-4">
				<ab-select
					:on-change="updateParams"
					:values="params.objects"
					:get-items="getObjects"
					:get-item="getObject"
					async
					label="Objects"
					params-key="objects"
					label-key="name"
					class="w-full max-w-sm mr-6 mb-4"
				/>
				<ab-select
					:on-change="updateParams"
					:values="params.devices"
					:get-items="getDevices"
					:get-item="getDevice"
					async
					label="Devices"
					params-key="devices"
					label-key="title"
					class="w-full max-w-sm mr-6 mb-4"
				/>
				<ab-select
					:on-change="updateParams"
					:values="params.locations"
					:get-items="getLocations"
					:get-item="getLocation"
					async
					label="Locations"
					params-key="locations"
					label-key="title"
					class="w-full max-w-sm mr-6 mb-4"
				/>
			</div>
			<ab-post-picture
				v-for="picture in pictures"
				:key="picture.id"
				:picture="picture"
			/>
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

const config = {
	perPage: 6
}

export default {
	components: { AbPostPicture, AbSelect, AbLoading },
	watchQuery: ['objects', 'devices', 'locations', 'orderby'],
	data () {
		return {
			sortOptions: [
				{ id: 'latest', name: 'Latest' },
				{ id: 'oldest', name: 'Oldest' },
				{ id: 'title', name: 'Title' }
			],
			isLoading: true
		}
	},
	async asyncData ({ query }) {
		const params = {
			objects: [],
			devices: [],
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

		return {
			pictures: pictures.results,
			total: pictures.total,
			isLoading: false,
			params
		}
	},
	mounted () {
		window.addEventListener('scroll', () => {
			if (this.params.offset + config.perPage < this.total && this.getScrollPosition() > 0.6) {
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

<style>

</style>
