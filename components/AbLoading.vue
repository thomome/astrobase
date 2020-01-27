<template>
	<div class="loading w-12" />
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
	.loading {
		box-sizing: content-box;

		&::before {
			@apply block relative rounded-full w-12 h-12 border-2 border-transparent;
			content: '';
			border-top-color: theme('colors.yellow.400');
			animation: rotate 1.2s .2s cubic-bezier(.63,.3,.39,.8) infinite;
		}

		&::after {
			@apply block absolute rounded-full w-12 h-12 border-2 border-transparent top-0;
			content: '';
			border-top-color: theme('colors.yellow.400');
			animation: rotate 1.2s .2s cubic-bezier(.63,.3,.39,.8) infinite;
		}
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}

		0% {
			transform: rotate(360deg);
		}
	}
</style>
