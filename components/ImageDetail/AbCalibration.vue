<template>
	<div
		class="calibration mr-16"
	>
		<h3
			v-if="title"
			class="picture__details-title section-title"
		>
			{{ title }}
		</h3>

		<ab-skymap
			v-if="frame"
			:ra="frame.ra"
			:dec="frame.dec"
			:lat="location.coords.lat"
			:lon="location.coords.lng"
			:width="frame.w"
			:height="frame.h"
			:time="timestamp"
			:orientation="frame.o"
			class="mt-2"
		/>
		<table
			v-if="frame"
			class="text-xs mt-2"
		>
			<tbody>
				<tr>
					<td class="pr-4 pb-1 align-top font-medium">
						Center (RA, DEC)
					</td>
					<td class="pb-1 align-top">
						{{ frame.ra.toFixed(4) }}, {{ frame.dec.toFixed(4) }}
					</td>
				</tr>
				<tr>
					<td class="pr-4 pb-1 align-top font-medium">
						Size
					</td>
					<td class="pb-1 align-top">
						{{ frame.w.toFixed(3) }} × {{ frame.h.toFixed(3) }}&#8239;deg
					</td>
				</tr>
				<tr>
					<td class="pr-4 pb-1 align-top font-medium">
						Radius
					</td>
					<td class="pb-1 align-top">
						{{ frame.radius.toFixed(3) }}&#8239;deg
					</td>
				</tr>
				<tr v-if="conditions.moonDist">
					<td class="pr-4 pb-1 align-top font-medium">
						Avg. Distance to Moon
					</td>
					<td class="pb-1 align-top">
						{{ (conditions.moonDist / Math.PI * 180).toFixed(2) * 1 }}&#8239;deg
					</td>
				</tr>
			</tbody>
		</table>
		<div v-if="conditions.moonIllum && conditions.moonPosAngle" class="flex my-4">
			<ab-icon-moon
				:illuminated="conditions.moonIllum"
				:position-angle="conditions.moonPosAngle"
				class="w-10 h-10"
			/>
			<div class="text-xs ml-4">
				<div>Avg. Moon phase<br><strong>{{ (conditions.moonIllum * 100).toFixed(2) * 1 }}&#8239;%</strong></div>
			</div>
		</div>
	</div>
</template>

<script>
import AbIconMoon from '../AbIconMoon.vue'
import AbSkymap from '../AbSkymap.vue'

import meeus from '~/assets/meeusjs/index.js'

export default {
	components: { AbSkymap, AbIconMoon },
	props: {
		title: { type: String, default: '' },
		frame: { type: Object, default: () => null },
		timestamp: { type: Number, default: 0 },
		location: { type: Object, default: () => null },
		data: { type: Array, default: () => [] }
	},
	computed: {
		conditions () {
			const { data, location, frame } = this

			const conditions = {}

			if (data.length > 0) {
				const sums = {}
				const keys = [ 'moonIllum', 'moonDist', 'moonPosAngle' ]

				data.forEach(({ values }) => {
					keys.forEach((k) => {
						if (values[k] !== 'undefined') {
							if (typeof sums[k] === 'undefined') {
								sums[k] = 0
							}

							sums[k] += values[k]
						}
					})
				})
				for (const [key, value] of Object.entries(sums)) {
					conditions[key] = value / data.length
				}
			} else if (location) {
				const date = new Date(this.timestamp)
				const jdo = new meeus.JulianDay(date)
				const obs = meeus.EclCoord.fromWgs84(location.coords.lat, location.coords.lng, location.elevation)
				const moonPos = meeus.Moon.topocentricPosition(jdo, obs, true)
				const sunPos = meeus.Solar.apparentTopocentric(jdo, obs)
				const phaseAngle = meeus.MoonIllum.phaseAngleEq2(moonPos.eq, sunPos)
				conditions.moonPosAngle = meeus.MoonIllum.positionAngle(moonPos.eq, sunPos)
				conditions.moonIllum = meeus.MoonIllum.illuminated(phaseAngle)

				if (frame) {
					const obj = new meeus.EqCoord(frame.ra / 180 * Math.PI, frame.dec / 180 * Math.PI)
					const sidereal = meeus.Sidereal.apparentInRa(jdo)
					const objPos = meeus.Coord.eqToHz(obj, obs, sidereal)
					const a = 	Math.sin(moonPos.hz.alt) * Math.sin(objPos.alt) +
								Math.cos(moonPos.hz.alt) * Math.cos(objPos.alt) * Math.cos(moonPos.hz.az - objPos.az)
					conditions.moonDist = Math.acos(a)
				}
			}
			return conditions
		}
	}
}
</script>

<style>

</style>
