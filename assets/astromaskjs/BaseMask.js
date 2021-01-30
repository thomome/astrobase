import makerjs from 'makerjs'

class BaseMask {
	constructor(outerDiameter, apertureDiameter, slitWidth, stemWidth, bridgeWidth, innerDiameter, centObsDiameter) {
		this.outerDiameter = outerDiameter;
		this.apertureDiameter = apertureDiameter;
		this.slitWidth = slitWidth;
		this.stemWidth = stemWidth;
		this.bridgeWidth = bridgeWidth;
		this.innerDiameter = innerDiameter || 0;
		this.centObsDiameter = centObsDiameter || 0;

		this.mask = this.createMask();
	}
	
	toSVG (units = 'mm') {
        const { exporter } = makerjs;
		const { mask } = this;

		return exporter.toSVG(mask, {
			units,
			strokeWidth: 0.1
		});
	}
	
	toDXF(units = 'mm') {
		const { exporter } = makerjs;
		const { mask } = this;

		return exporter.toDXF(mask, {
			units
		});
	}
    
    createMask() {
        const { Ellipse } = makerjs.models;

        const mask = { models: [] };
        mask.models.push(new Ellipse(outerDiameter / 2, outerDiameter / 2))
        return mask;
    }
	
	createArea(outerRadius, innerRadius, startAngle, endAngle, bridgeWidth) {
		const { Rectangle, EllipticArc, Ellipse, ConnectTheDots } = makerjs.models;
		const { move, rotate, combineUnion, combineSubtraction, addModel } = makerjs.model;
		
		const bridge1 = new Rectangle(outerRadius * 2, bridgeWidth);
		move(bridge1, [0, -bridgeWidth / 2]);
		rotate(bridge1, startAngle);

		const bridge2 = new Rectangle(outerRadius * 2, bridgeWidth);
		move(bridge2, [0, -bridgeWidth / 2]);
		rotate(bridge2, endAngle);
		
		const bridge = combineUnion(bridge1, bridge2);
        
        const outerArc = new EllipticArc(startAngle, endAngle, outerRadius, outerRadius);
        
		const start = [
			Math.cos(startAngle / 180 * Math.PI) * outerRadius, 
			Math.sin(startAngle / 180 * Math.PI) * outerRadius
		];
		const end = [
			Math.cos(endAngle / 180 * Math.PI) * outerRadius, 
			Math.sin(endAngle / 180 * Math.PI) * outerRadius
        ];
        
		addModel(outerArc, new ConnectTheDots(false, [start, [0, 0], end]));
		
        const outerArea = combineSubtraction(outerArc, bridge)
        
        if(!innerRadius) {
            return outerArea;
        }
		
        const innerArc = new Ellipse(innerRadius, innerRadius);
		const area = combineSubtraction(outerArea, innerArc);
		return area;
	}
	
	createSlits (rotationAngle, slitWidth, stemWidth) {
		const { Rectangle } = makerjs.models;
		const { move, rotate } = makerjs.model;
		const { apertureDiameter } = this;
		const apertureRadius = apertureDiameter / 2;
		
		const slits = { models: [] };
		const n = Math.ceil((apertureDiameter * 2) / ( slitWidth + stemWidth ));
		const width = (slitWidth * n + stemWidth * (n - 1));
		
		for (let i = 0; i < n; i++) {
			const slit = new Rectangle(apertureDiameter * 2, slitWidth);
			move(slit, [0, (slitWidth + stemWidth) * i]);
			slits.models.push(slit);
		}
		move(slits, [-apertureDiameter, -width / 2])
		rotate(slits, rotationAngle, [0, 0]);
		
		return slits;
	}
}

export {
	BaseMask
}