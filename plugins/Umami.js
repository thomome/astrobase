export default (context) => {
	const config = context.$config && (context.$config.umami || {})

	if (config.scriptUrl && config.websiteId) {
		const head = document.head || document.getElementsByTagName('head')[0]
		const script = document.createElement('script')
		script.async = true
		script.defer = true
		script.src = config.scriptUrl
		script.dataset.websiteId = config.websiteId

		if ('autoTrack' in config) {
			script.dataset.autoTrack = config.autoTrack
		}

		if ('doNotTrack' in config) {
			script.dataset.doNotTrack = config.doNotTrack
		}

		if ('domains' in config) {
			script.dataset.domains = config.domains
		}

		if ('cache' in config) {
			script.dataset.cache = config.cache
		}

		head.appendChild(script)
	}
}
