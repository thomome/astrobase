import { isEqual, sortBy } from 'lodash'
import { getPictures } from '~/api/api.js'

export const state = () => ({
	results: [],
	total: 0,
	offset: 0,
	limit: 12,
	orderBy: 'latest',
	displayMode: 'list',
	filterObjects: [],
	filterLocations: [],
	filterDevices: []
})

export const getters = {
	results (state) {
		return state.results
	},
	total (state) {
		return state.total
	},
	offset (state) {
		return state.offset
	},
	limit (state) {
		return state.limit
	},
	displayMode (state) {
		return state.displayMode
	},
	orderBy (state) {
		return state.orderBy
	},
	filterObjects (state) {
		return state.filterObjects
	},
	filterLocations (state) {
		return state.filterLocations
	},
	filterDevices (state) {
		return state.filterDevices
	}
}

export const mutations = {
	addPictures (state, pictures) {
		state.results.push(...pictures)
	},
	setPictures (state, pictures) {
		state.results = pictures
	},
	setTotal (state, total) {
		state.total = total
	},
	setFilterObjects (state, objects) {
		state.filterObjects = objects
	},
	setFilterDevices (state, devices) {
		state.filterDevices = devices
	},
	setFilterLocations (state, locations) {
		state.filterLocations = locations
	},
	setDisplayMode (state, displayMode) {
		state.displayMode = displayMode
	},
	setOrderBy (state, orderBy) {
		state.orderBy = orderBy
	},
	resetOffset (state) {
		state.offset = 0
	},
	increaseOffset (state) {
		state.offset += state.limit
	}
}

export const actions = {
	async load ({ commit, state }, params) {
		const { objects, devices, locations, orderby } = params
		if (
			!isEqual(sortBy(state.filterObjects), sortBy(objects)) ||
			!isEqual(sortBy(state.filterDevices), sortBy(devices)) ||
			!isEqual(sortBy(state.filterLocations), sortBy(locations)) ||
			state.orderBy !== orderby ||
			state.total === 0
		) {
			commit('resetOffset')
			commit('setFilterObjects', objects)
			commit('setFilterDevices', devices)
			commit('setFilterLocations', locations)
			commit('setOrderBy', orderby)

			const response = await getPictures({
				objects: state.filterObjects,
				devices: state.filterDevices,
				locations: state.filterLocations,
				limit: state.limit,
				offset: state.offset,
				orderby: state.orderBy
			})
			commit('setTotal', response.total)
			commit('setPictures', response.results)
		}
	},
	async loadMore ({ commit, state }) {
		commit('increaseOffset')
		const response = await getPictures({
			objects: state.filterObjects,
			devices: state.filterDevices,
			locations: state.filterLocations,
			limit: state.limit,
			offset: state.offset,
			orderby: state.orderBy
		})
		commit('setTotal', response.total)
		commit('addPictures', response.results)
	}
}
