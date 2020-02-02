import axios from 'axios'

const url = 'http://astrobase.site/wp-json/astrobase'

// Page
const getPage = async (path) => {
	const endpoint = 'page'
	const q = await axios.get(`${url}/${endpoint}/${path}`)
	return q.data
}

// Pictures
const getPictures = async (params = {}) => {
	const endpoint = 'pictures'
	const q = await axios.get(`${url}/${endpoint}`, {
		params
	})
	return q.data
}

const getPicture = async (id) => {
	const endpoint = 'picture'
	const q = await axios.get(`${url}/${endpoint}/${id}`)
	return q.data
}

// Objects
const getObjects = async (query) => {
	const endpoint = 'objects'
	const q = await axios.get(`${url}/${endpoint}`, {
		params: {
			query: query || ''
		}
	})
	return q.data
}

const getObject = async (id) => {
	const endpoint = 'object'
	const q = await axios.get(`${url}/${endpoint}/${id}`)
	return q.data
}

// Devices
const getDevices = async (query) => {
	const endpoint = 'devices'
	const q = await axios.get(`${url}/${endpoint}`, {
		params: {
			query: query || ''
		}
	})
	return q.data
}

const getDevice = async (id) => {
	const endpoint = 'object'
	const q = await axios.get(`${url}/${endpoint}/${id}`)
	return q.data
}

export {
	getPage,
	getPictures,
	getPicture,
	getObjects,
	getObject,
	getDevices,
	getDevice
}