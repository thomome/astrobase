import makerjs from 'makerjs'
import { BaseMask } from './BaseMask';

class CareyMask extends BaseMask {
	createMask() {
		const { innerDiameter, outerDiameter, apertureDiameter, centObsDiameter, slitWidth, stemWidth, bridgeWidth } = this;
		const { combineIntersection } = makerjs.model;
		const { Ellipse } = makerjs.models;

		const apertureRadius = apertureDiameter / 2;
		const centObsRadius = centObsDiameter / 2;
		
		const sections = [];

		const angle1 = 6;
		const angle2 = 5
		
		sections.push({
			area: this.createArea(apertureRadius, centObsRadius, angle1, 90, bridgeWidth),
			slits: this.createSlits(angle1, slitWidth, stemWidth)
		});
		
		sections.push({
			area: this.createArea(apertureRadius, centObsRadius, 90, 180 - angle2, bridgeWidth),
			slits: this.createSlits(-angle2, slitWidth, stemWidth)
		});

		sections.push({
			area: this.createArea(apertureRadius, centObsRadius, 180 + angle2, 270, bridgeWidth),
			slits: this.createSlits(angle2, slitWidth, stemWidth)
		});

		sections.push({
			area: this.createArea(apertureRadius, centObsRadius, 270, 360 - angle1, bridgeWidth),
			slits: this.createSlits(-angle1, slitWidth, stemWidth)
		});

		const mask = { models: [] };
		sections.forEach(({area, slits}) => {
			mask.models.push(combineIntersection(slits, area));
		});

		mask.models.push(new Ellipse(outerDiameter / 2, outerDiameter / 2))
		if(centObsRadius) {
			mask.models.push(new Ellipse(innerDiameter / 2, innerDiameter / 2))
		}

		return mask;
	}
}

export {
	CareyMask
}