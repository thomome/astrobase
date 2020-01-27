<template>
	<main class="main-content">
		<ab-picture
			:annotated="true"
			:annotations="picture.annotations"
			:image="picture.image"
		/>
	</main>
</template>

<script>
import { getPicture } from '~/api/api.js'

import AbPicture from '~/components/AbPicture.vue'

export default {
	components: { AbPicture },
	async asyncData ({ params }) {
		const picture = await getPicture(params.id)

		return {
			picture: picture.result
		}
	}
}
</script>

<style>

</style>
