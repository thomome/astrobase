function clamp (val, min, max) {
	if (val < min) {
		val = min
	} else if (val > max) {
		val = max
	}
	return val
}

export { clamp }
