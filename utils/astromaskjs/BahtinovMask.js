import makerjs from 'makerjs'
import { BaseMask } from './BaseMask';

class BahtinovMask extends BaseMask {
    createMask() {
        const { innerDiameter, outerDiameter, apertureDiameter, centObsDiameter, slitWidth, stemWidth, bridgeWidth } = this;
        const { combineIntersection } = makerjs.model;
        const { Ellipse } = makerjs.models;

		const apertureRadius = apertureDiameter / 2;
        const centObsRadius = centObsDiameter / 2;
        
        const sections = [];
        
		sections.push({
            area: this.createArea(apertureRadius, centObsRadius, 0, 180, bridgeWidth),
            slits: this.createSlits(90, slitWidth, stemWidth)
        });
        
        sections.push({
            area: this.createArea(apertureRadius, centObsRadius, 180, 270, bridgeWidth),
            slits: this.createSlits(70, slitWidth, stemWidth)
        });

        sections.push({
            area: this.createArea(apertureRadius, centObsRadius, 270, 360, bridgeWidth),
            slits: this.createSlits(110, slitWidth, stemWidth)
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
	BahtinovMask
}