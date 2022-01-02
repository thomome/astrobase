<template>
	<main class="main-content">
		<div class="picture-list container mt-24 md:mt-40">
			<h1 class="picture-list__title text-5xl text-gray-200 tracking-wide font-semibold mb-4">
				Tools
			</h1>

			<div class="flex">
				<nuxt-link
					to="/tools/mask-generator"
					tag="div"
					class="cursor-pointer w-1/3"
				>
					<h2 class="text-xl leading-tight font-normal text-gray-200">
						Mask Generator
					</h2>
					<p class="font-light leading-snug mb-3">
						Generate mask for focusing and collimation.
					</p>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 515.54 323.81">
						<path
							vector-effect="non-scaling-stroke"
							stroke="#ffffff"
							fill="none"
							stroke-width="0.5"
							d="M563.46,121.52c0-1.46,0-2.9-.05-4.35H347.65q.09,2.16.09,4.35a103.47,103.47,0,0,1-206.93,0c0-1.46,0-2.91.1-4.35H48.2v256.2A319.19,319.19,0,0,0,563.46,121.52ZM81.08,358.81q-9.9-6.81-19.2-14.42V131.44h19.2Zm38.4,22.26q-9.8-4.71-19.2-10.14V131.44h19.2Zm38.4,15.18q-9.72-3.06-19.2-6.79v-210a120,120,0,0,0,19.2,26Zm38.4,9.24q-9.66-1.64-19.2-3.92V221.5A120,120,0,0,0,196.28,232Zm38.4,3.87q-9.62-.33-19.2-1.29V238.5a120.81,120.81,0,0,0,19.2,3.11Zm38.4-1.29q-9.57,1-19.2,1.29V241.61a121.18,121.18,0,0,0,19.2-3.11Zm38.4-6.5q-9.53,2.28-19.2,3.92V232a120.43,120.43,0,0,0,19.2-10.51Zm38.4-12.11q-9.48,3.74-19.2,6.79V205.47a120.35,120.35,0,0,0,19.2-26Zm38.4-18.53q-9.4,5.43-19.2,10.14V131.44h19.2Zm38.4-26.54q-9.3,7.61-19.2,14.42V131.44h19.2Zm38.4-38q-8.16,9.75-17.15,18.74l-2.05,2V131.44h19.2Zm38.4-59.37a287.55,287.55,0,0,1-19.2,33.66V131.44h19.2Zm19.2-115.61h9.43a288.57,288.57,0,0,1-9.43,63.81Z"
							transform="translate(-48.06 -117.03)"
						/>
					</svg>
				</nuxt-link>
			</div>
		</div>
	</main>
</template>

<script>
export default {
	data () {
		return {}
	},
	head () {
		const meta = {
			title: 'Tools - Astrobase',
			meta: [
				{ property: 'og:type', content: 'website' },
				{ property: 'og:title', content: 'Tools' },
				{ property: 'og:description', content: 'Tools for astrophotography.' }
			]
		}
		return meta
	}
}
</script>

<style lang="scss" scoped>
</style>
