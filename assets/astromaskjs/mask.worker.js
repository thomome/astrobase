import { BahtinovMask } from '~/assets/astromaskjs/BahtinovMask'
import { TriBahtinovMask } from '~/assets/astromaskjs/TriBahtinovMask'

const masks = {
	BahtinovMask,
	TriBahtinovMask
}

let mask = null

self.addEventListener('message', ({ data }) => {
	const { type, options } = data;
	let content = '';

	switch (data.type) {
		case 'render.svg':
			content = renderMask(options)
			self.postMessage({
				type,
				content
			})
			break
		case 'export.svg':
			content = mask.toSVG(options.units)
			self.postMessage({
				type,
				fileType: 'svg',
				content: new Blob([content], {type : 'image/svg+xml'})
			})
			break
		case 'export.dxf':
			content = mask.toDXF(options.units)
			self.postMessage({
				type,
				fileType: 'dxf',
				content: new Blob([content], {type : 'application/dxf'})
			})
			break
	}
})

const renderMask = (options) => {
	const { maskType, outerDiameter, apertureDiameter, slitWidth, stemWidth, bridgeWidth, innerDiameter, centObsDiameter, units } = options

	if (masks[maskType])	{
		mask = new masks[maskType](
			Number(outerDiameter),
			Number(apertureDiameter),
			Number(slitWidth),
			Number(stemWidth),
			Number(bridgeWidth),
			Number(innerDiameter),
			Number(centObsDiameter)
		)
		return mask.toSVG(units)
	}
}
