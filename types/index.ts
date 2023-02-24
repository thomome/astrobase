export interface ApiResponseSingle<T> {
	status: 'success' | 'error';
	time: string;
	result?: T;
}

export interface ApiResponseList<T> {
	status: 'success' | 'error';
	time: string;
	offset: number;
	limit: number;
	total: number;
	results?: T[];
}

export interface Annotation {
	long_name: string;
	name: string;
	names: { type: string, name: string }[];
	object_id: number;
	pixelx: number;
	pixely: number;
	radius: number;
	slug: string;
	type: string;
}

export interface Calibration {
	ra: number;
	dec: number;
	imageh: number;
	imagew: number;
	orientation: number;
	parity: -1 | 1;
	pixscale: number;
	radius: number;
}

export interface Image {
	id: number;
	date: string;
	timestamp: number;
	description: string;
	width: number;
	height: number;
	annotations?: Annotation[];
	calibration?: Calibration;
	mime_type: string;
	url: string;
	original: string;
	sizes: { [key: string]: any };
}

export interface Action {
	title: string;
	url: string;
	target: string;
}

export interface DeepSkyObject {
    id: number; 
    slug: string;
    name: string;
    names: { type: string; name: string }[];
    long_name: string;
    radius: string;
}

export interface Exposure {
    amount: string;
    exposure_time: string;
    gain: string;
    mode: {
        value: string;
        label: string;
    }
}

export interface Location {
    id: number;
    title: string;
    coords: {
        lat: number;
        lng: number;
    }
    elevation: string;
    bortle: string;
}

export interface Device {
    id: number;
    name: string;
    brand: string;
    title: string;
    type: string;
    image: Image;
}

export interface Picture {
    id: number;
    date: string;
    timestamp: number;
    title: string;
    description: string;
    excerpt: string;
    objects: DeepSkyObject[];
    exposures: Exposure[];
    location: Location[];
    image: Image[];
}

export interface Page {
	id: number;
	tagline: string;
	title: string;
	hero_image: Image;
	description: string;
	action: Action;
}