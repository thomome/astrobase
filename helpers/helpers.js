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

function movingAverage (array, prop = null, window = 5) {
	return array.map((obj, index) => {
		let sum = 0
		let count = 0
		for (let i = (window - 1) * -0.5; i <= (window - 1) * 0.5; i++) {
			const o2 = array[index + i]
			const value = prop && o2 ? o2[prop] : o2
			if (!isNaN(value)) {
				sum += value
				count++
			}
		}
		const avg = count > 0 ? sum / count : 0
		if (prop) {
			obj[prop] = avg
		} else {
			obj = avg
		}

		return obj
	})
}

export { clamp, ceilMinutes, floorMinutes, movingAverage }
