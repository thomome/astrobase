import axios from 'axios'
import { ApiResponseList, ApiResponseSingle, DeepSkyObject, Device, Location, Page, Picture } from '~~/types'

const url = 'http://astrobase.site/wp-json/astrobase'

interface GetListOptions {
	limit?: number;
	offset?: number;
}

// Site
const getSite = async () => {
	const endpoint = 'site'
	const q = await axios.get(`${url}/${endpoint}`)
	return q.data;
}

// Page
const getPage = async (path: string = 'home') => {
	const endpoint = 'page'
	const q = await axios.get(`${url}/${endpoint}/${path}`)
	return q.data as ApiResponseSingle<Page>;
}

// Posts
const getPosts = async (params = {}) => {
	const endpoint = 'posts'
	const q = await axios.get(`${url}/${endpoint}`, {
		params
	})
	return q.data
}

const getPost = async (slug: string) => {
	const endpoint = 'post'
	const q = await axios.get(`${url}/${endpoint}/${slug}`)
	return q.data
}

// Pictures
const getPictures = async (params: GetListOptions = {}) => {
	const endpoint = 'pictures'
	const q = await axios.get(`${url}/${endpoint}`, {
		params
	})
	return q.data as ApiResponseList<Picture>;
}

const getPicture = async (id: number) => {
	const endpoint = 'picture'
	const q = await axios.get(`${url}/${endpoint}/${id}`)
	return q.data as ApiResponseSingle<Picture>;
}

// Objects
const getObjects = async (params: GetListOptions = {}) => {
	const endpoint = 'objects'
	const q = await axios.get(`${url}/${endpoint}`, {
		params
	})
	return q.data as ApiResponseList<DeepSkyObject>;
}

const getObject = async (id: number) => {
	const endpoint = 'object'
	const q = await axios.get(`${url}/${endpoint}/${id}`)
	return q.data as ApiResponseSingle<DeepSkyObject>;
}

// Devices
const getDevices = async (params: GetListOptions = {}) => {
	const endpoint = 'devices'
	const q = await axios.get(`${url}/${endpoint}`, {
		params
	})
	return q.data as ApiResponseList<Device>;
}

const getDevice = async (id: number) => {
	const endpoint = 'device'
	const q = await axios.get(`${url}/${endpoint}/${id}`)
	return q.data as ApiResponseSingle<Device>;
}

// Devices
const getLocations = async (params: GetListOptions = {}) => {
	const endpoint = 'locations'
	const q = await axios.get(`${url}/${endpoint}`, {
		params
	})
	return q.data as ApiResponseList<Location>;
}

const getLocation = async (id: number) => {
	const endpoint = 'location'
	const q = await axios.get(`${url}/${endpoint}/${id}`)
	return q.data as ApiResponseSingle<Location>;
}

export {
	getSite,
	getPage,
	getPost,
	getPosts,
	getPictures,
	getPicture,
	getObjects,
	getObject,
	getDevices,
	getDevice,
	getLocations,
	getLocation
}
