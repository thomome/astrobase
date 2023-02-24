<template>
	<div class="loading text-yellow-400">
		<div class="loading__spinner" />
	</div>
</template>

<style lang="scss" scoped>
	.loading {
		width: min-content;
	}

	.loading__spinner {
		@apply relative;
		box-sizing: content-box;
		width: 1.25em;
		height: 1.25em;

		&::before,
		&::after {
			@apply block absolute w-full h-full rounded-full border-transparent top-0;
			border-width: 2px;
			content: '';
			border-top-color: currentColor;
		}

		&::before {
			@apply relative;
			animation: rotate 1.2s 0s cubic-bezier(.63,.3,.39,.8) infinite;
		}

		&::after {
			animation: rotate 1.2s .15s cubic-bezier(.63,.3,.39,.8) infinite;
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
