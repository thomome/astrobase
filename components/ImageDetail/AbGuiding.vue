<template>
	<div
		class="guiding mr-16"
	>
		<h3
			v-if="title"
			class="picture__details-title section-title"
		>
			{{ title }}
		</h3>

		<table
			v-if="guiding"
			class="text-xs mt-2"
		>
			<tbody>
				<tr>
					<td class="pr-4 pb-1 align-top font-medium">
						RMS (RA, DEC)
					</td>
					<td class="pb-1 align-top">
						{{ guiding.rms_ra }}&#8239;", {{ guiding.rms_dec }}&#8239;"
					</td>
				</tr>
				<tr>
					<td class="pr-4 pb-1 align-top font-medium">
						RMS Total
					</td>
					<td class="pb-1 align-top">
						{{ guiding.rms_total }}&#8239;"
					</td>
				</tr>
				<tr>
					<td class="pr-4 pb-1 align-top font-medium">
						Polar Alignment Error
					</td>
					<td class="pb-1 align-top">
						{{ guiding.polar_align_error }}&#8239;'
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	props: {
		title: { type: String, default: '' },
		guiding: { type: Object, default: () => null }
	}
}
</script>

<style>

</style>
