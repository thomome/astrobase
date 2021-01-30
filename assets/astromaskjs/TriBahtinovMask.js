import makerjs from 'makerjs'
import { BaseMask } from './BaseMask.js';

class TriBahtinovMask extends BaseMask {
    createMask() {
        const { innerDiameter, outerDiameter, apertureDiameter, centObsDiameter, slitWidth, stemWidth, bridgeWidth } = this;
        const { combineIntersection } = makerjs.model;
        const { Ellipse } = makerjs.models;

		const apertureRadius = apertureDiameter / 2;
        const centObsRadius = centObsDiameter / 2;

        const nLayer = 2;
        const layerWidth = (apertureRadius - centObsRadius - bridgeWidth) / nLayer;
        const layerRadius = [];

        for(let i = 0; i < nLayer; i++) {
            const inner = centObsRadius + (layerWidth + bridgeWidth) * i;
            layerRadius.push({
                inner,
                outer: inner + layerWidth
            })
        }

        const nSections = 3;
        const sections = [];

        for(let i = 0; i < nSections; i++) {
            const largeAngle = (360 / nSections);
            const smallAngle = largeAngle / 2;
            const startAngle = largeAngle * i;

            sections.push({
                area: this.createArea(layerRadius[0].outer, layerRadius[0].inner, startAngle, startAngle + largeAngle, bridgeWidth),
                slits: this.createSlits(startAngle + largeAngle / 2, slitWidth, stemWidth)
            });
            
            sections.push({
                area: this.createArea(layerRadius[1].outer, layerRadius[1].inner, startAngle + 180, startAngle + 180 + smallAngle, bridgeWidth),
                slits: this.createSlits(startAngle +  largeAngle / 2 + 180 - 10, slitWidth, stemWidth)
            });
    
            sections.push({
                area: this.createArea(layerRadius[1].outer, layerRadius[1].inner, startAngle + 180 + smallAngle, startAngle + 180 + smallAngle * 2, bridgeWidth),
                slits: this.createSlits(startAngle + largeAngle / 2 + 180 + 10, slitWidth, stemWidth)
            });
        }

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
    TriBahtinovMask
}