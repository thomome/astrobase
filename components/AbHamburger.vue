<template>
	<div
		:class="'hamburger' + (active ? ' hamburger--active' : '')"
	>
		<div class="hamburger__bar" />
		<div class="hamburger__bar" />
		<div class="hamburger__bar" />
	</div>
</template>

<script>
export default {
	props: {
		active: { type: Boolean, default: false }
	}
}
</script>

<style lang="scss" scoped>
	.hamburger {
		@apply relative flex flex-col justify-around p-2;
		width: 1.5em;
		height: 1.5em;
		box-sizing: content-box;
	}

	.hamburger__bar {
		@apply w-full bg-yellow-400;
		height: 2px;
		transition: transform .3s;

		&:nth-child(1) {
			transform-origin: top right;
		}

		&:nth-child(2) {
			transform-origin: center right;
		}

		&:nth-child(3) {
			transform-origin: bottom right;
		}
	}

	.hamburger--active {
		.hamburger__bar:nth-child(1) {
			transform: translateX(-18%) rotate(-45deg);
		}

		.hamburger__bar:nth-child(2) {
			transform: scaleX(0);
		}

		.hamburger__bar:nth-child(3) {
			transform: translateX(-18%) rotate(45deg);
		}
	}
</style>
