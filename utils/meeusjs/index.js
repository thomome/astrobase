var modules = [];

modules.push(require("./lib/Astro.Coord.js"));
modules.push(require("./lib/Astro.DeltaT.js"));
modules.push(require("./lib/Astro.Globe.js"));
modules.push(require("./lib/Astro.Interp.js"));
modules.push(require("./lib/Astro.JulianDay.js"));
modules.push(require("./lib/Astro.Math.js"));
modules.push(require("./lib/Astro.Moon.js"));
modules.push(require("./lib/Astro.MoonIllum.js"));
modules.push(require("./lib/Astro.Nutation.js"));
modules.push(require("./lib/Astro.Parallax.js"));
modules.push(require("./lib/Astro.Refraction.js"));
modules.push(require("./lib/Astro.Rise.js"));
modules.push(require("./lib/Astro.Sidereal.js"));
modules.push(require("./lib/Astro.Solar.js"));

// join all modules
for(var i = 0; i < modules.length; i++) {
	for(var key in modules[i]) {
		if(modules[i].hasOwnProperty(key)) {
			exports[key] = modules[i][key];
		}
	}
}