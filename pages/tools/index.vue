<template>
	<main class="main-content">
		<div class="picture-list container mt-24 md:mt-40">
			<h1 class="picture-list__title text-5xl text-gray-200 tracking-wide font-semibold mb-4">
				Tools
			</h1>

			<div class="tools">
				<nuxt-link
					to="/tools/mask-generator"
					tag="div"
					class="tool cursor-pointer relative flex flex-col px-6 pt-6 pb-6"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 515.54 323.81">
						<path
							vector-effect="non-scaling-stroke"
							stroke="#ffffff"
							fill="none"
							stroke-width="0.5"
							d="M515.54,319.309c0,1.46 0,2.9 -0.05,4.35l-215.877,0c0.06,-1.44 0.09,-2.89 0.09,-4.35c-0.555,-56.375 -47.113,-102.452 -103.521,-102.452c-56.409,0 -102.967,46.077 -103.522,102.452c0,1.46 0,2.91 0.1,4.35l-92.76,0l0,-256.2c56.066,-43.621 125.125,-67.319 196.177,-67.319c175.189,0 319.352,144.075 319.363,319.169Zm-482.642,-237.29c-6.604,4.54 -13.007,9.347 -19.211,14.42l0,212.95l19.211,0l0,-227.37Zm38.421,-22.26c-6.537,3.14 -12.941,6.52 -19.211,10.14l0,239.49l19.211,0l0,-249.63Zm38.421,-15.18c-6.484,2.04 -12.887,4.304 -19.211,6.79l0,210c5.201,-9.492 11.663,-18.238 19.211,-26l0,-190.79Zm38.42,-9.24c-6.443,1.094 -12.847,2.4 -19.21,3.92l0,180.07c6.07,-4.077 12.5,-7.592 19.21,-10.5l0,-173.49Zm38.421,-3.87c-6.416,0.22 -12.82,0.65 -19.21,1.29l0,169.57c6.309,-1.551 12.734,-2.591 19.21,-3.11l0,-167.75Zm38.421,1.29c-6.383,-0.666 -12.787,-1.096 -19.21,-1.29l0,167.75c6.476,0.521 12.9,1.561 19.21,3.11l0,-169.57Zm38.421,6.5c-6.357,-1.52 -12.76,-2.826 -19.21,-3.92l0,173.49c6.709,2.914 13.139,6.431 19.21,10.51l0,-180.08Zm38.421,12.11c-6.323,-2.493 -12.727,-4.756 -19.21,-6.79l0,190.78c7.543,7.764 14.005,16.51 19.21,26l0,-209.99Zm38.421,18.53c-6.27,-3.62 -12.674,-7 -19.211,-10.14l0,249.63l19.211,0l0,-239.49Zm38.421,26.54c-6.204,-5.073 -12.607,-9.88 -19.211,-14.42l0,227.37l19.211,0l0,-212.95Zm38.421,38c-5.443,-6.5 -11.163,-12.746 -17.16,-18.74l-2.051,-2l0,195.69l19.211,0l0,-174.95Zm38.42,59.37c-5.638,-11.639 -12.057,-22.884 -19.21,-33.66l0,149.24l19.21,0l0,-115.58Zm19.211,115.61l9.435,0c-0.749,-21.555 -3.914,-42.959 -9.435,-63.81l0,63.81Z"
						/>
					</svg>
					<h2 class="mt-5 text-2xl text-gray-200 tracking-wide font-normal">
						Mask Generator
					</h2>
					<p class="font-light leading-snug">
						Generate bathinov, tri-bathinov, carey and other mask for focusing and collimation.
					</p>
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
	.tools {
		display: grid;
		gap: 2rem;
		grid-auto-flow: row dense;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
	}

	.tool {
		background: #ffffff08;
		border-radius: 10px;
		transition: all 0.15s;

		&:hover {
			background: #ffffff15;
		}
	}
</style>
