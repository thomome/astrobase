<template>
	<div class="picture relative block">
		<div class="picture__image-container w-full h-full">
			<nuxt-link
				:to="`/pictures/${picture.id}`"
				:aria-label="picture.title"
			>
				<ab-image
					:image="image"
					:sizes="sizes"
					class="picture__image w-full h-full object-cover"
				/>
				<div class="picture__info">
					<div class="flex justify-between">
						<div v-if="modes.length > 0" class="picture__text a-top d-3">
							<ab-tag
								v-for="mode in modes"
								:key="mode.value"
								:label="mode.label"
								:type="mode.value"
								class="sm"
							/>
						</div>
						<div v-if="totalExposureTime" class="picture__text a-top d-4 hidden sm:block">
							<span class="text-sm text-gray-200" v-html="totalExposureTime" />
						</div>
					</div>
					<h4 class="picture__text a-top d-2 font-medium text-gray-200 leading-tight text-sm sm:text-xl mt-auto">
						{{ picture.title }}
					</h4>
					<div class="picture__text a-top d-1 text-gray-500 text-sm leading-relaxed hidden sm:block">
						{{ picture.date }}<span v-if="picture.location[0]"> - {{ picture.location[0].title }}</span>
					</div>
				</div>
			</nuxt-link>
		</div>
	</div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { Picture, Exposure } from '~~/types'

const props = withDefaults(defineProps<{
	picture: Picture;
	sizes: string;
}>(), {
	sizes: '100vw'
});

const image = computed(() => {
	return props.picture.image[0]
})

const modes = computed(() => {
	const modes = props.picture.exposures.reduce<Map<string, Exposure['mode']>>((modes, { mode }) => {
		if (!modes.get(mode.value)) {
			modes.set(mode.value, mode);
		}
		return modes;
	}, new Map());
	return Array.from(modes.values());
});

const totalExposureTime = computed(() => {
	const secs = props.picture.exposures.reduce((sum, {exposure_time, amount}) => {
		return sum + parseInt(exposure_time) * parseInt(amount)
	}, 0);

	const duration = moment.duration(secs * 1000);
	const hours = duration.hours();
	const minutes = duration.minutes();
	const seconds = duration.seconds();

	let durationString = ''
	if (hours) { durationString += `${hours}&#8239;<small>h</small> ` }
	if (minutes) { durationString += `${minutes}&#8239;<small>min</small> ` }
	if (seconds) { durationString += `${seconds}&#8239;<small>s</small>` }

	return durationString;
});
</script>

<style lang="scss" scoped>
	.picture {
		.picture__info {
			position: absolute;
			display: flex;
			flex-direction: column;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			padding: .75rem;
			opacity: 0;
			background: linear-gradient(0deg, #000000cc, #00000066);
			transition: opacity 0.25s;

			@screen sm {
				padding: 1rem;
			}
		}

		.picture__text {
			opacity: 0;
			transition: transform 0.4s, opacity 0.5s;

			&.a-top {
				transform: translateY(-20px);
			}

			@for $i from 1 through 6 {
				&.d-#{$i} {
					transition-delay: #{$i * 0.05}s;
				}
			}
		}

		&:hover {
			.picture__info {
				opacity: 1;
			}

			.picture__text {
				transform: translate(0, 0);
				opacity: 1;
			}
		}
	}
</style>
