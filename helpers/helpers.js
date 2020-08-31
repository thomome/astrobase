function clamp (val, min = 0, max = 1) {
	if (val < min) {
		val = min
	} else if (val > max) {
		val = max
	}
	return val
}

function floorMinutes (value, minutes = 5) {
	return Math.floor(value / 60 / minutes) * 60 * minutes
}

function ceilMinutes (value, minutes = 5) {
	return Math.ceil(value / 60 / minutes) * 60 * minutes
}

export { clamp, ceilMinutes, floorMinutes }
