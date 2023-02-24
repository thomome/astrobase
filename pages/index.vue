<template>
	<main class="main-content">
		<ab-hero
			:title="page?.title"
			:tagline="page?.tagline"
			:description="page?.description"
			:action="page?.action"
		>
			<ab-picture
				:annotations="page?.hero_image.annotations"
				:image="page?.hero_image"
				:annotated="false"
				sizes="max(100vw, 100vh)"
			/>
		</ab-hero>
		<div class="picture-list container md:mt-24 mt-12">
			<h2 class="md:text-4xl text-2xl text-gray-200 tracking-wide font-semibold md:mb-4 mb-2">
				Recent Pictures
			</h2>
			<ab-masonry-grid :pictures="pictures" />

			<div class="flex justify-center pt-8 md:pb-24 pb-8">
				<nuxt-link
					to="/pictures"
					class="button"
				>
					Show all
				</nuxt-link>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">

const [{ data: page }, { data: pictures }] = await Promise.all([
	useAsyncData('page:home', () => getPage('home'), { 
		transform: (data) => data.result 
	}),
    useAsyncData('pictures:teasers', () => getPictures({ limit: 12 }), { 
		transform: (data)  => data.results
	})
])

useHead(() => {
	return {
		title: `${page.value?.title}${page.value?.tagline ? ' | ' + page.value.tagline : ''}`,
		meta: [
			{ hid: 'description', name: 'description', content: page.value?.description || '' },
			{ property: 'og:type', content: 'website' },
			{ property: 'og:title', content: `${page.value?.title}` },
			{ property: 'og:image', content: `${page.value?.hero_image.sizes.small}` },
			{ property: 'og:image:width', content: `${page.value?.hero_image.sizes['small-width']}` },
			{ property: 'og:image:height', content: `${page.value?.hero_image.sizes['small-height']}` }
		]
	}
});
</script>

<style>

</style>
