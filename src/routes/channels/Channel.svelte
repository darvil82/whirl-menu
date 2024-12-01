<script lang="ts">
	import type { Component } from 'svelte';
	import DefaultThumbnail from './channels_def/default_thumbnail/DefaultThumbnail.svelte';
	import { ButtonSoundType, playSound } from '$lib/sounds/sound_types';

	const { thumbnail: Thumbnail }: { thumbnail?: Component } = $props();

	function hover(e: Event) {
		if (Thumbnail) playSound(ButtonSoundType.HOVER);
	}
</script>

<button class="wrapper" class:active={Thumbnail} onmouseover={hover} onfocus={hover}>
	<div class="channel">
		<div class="content">
			{#if Thumbnail}
				<Thumbnail />
			{:else}
				<DefaultThumbnail />
			{/if}
		</div>
	</div>
</button>

<style lang="scss">
	.wrapper {
		position: relative;

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			mask: url('./channel_hover_mask.png');
			mask-size: 100% 100%;
			background: #2ebff0a6;
			opacity: 0;
			scale: 0.9;
			transition: 0.5s ease-in;
		}

		&.active {
			cursor: pointer;

			&:hover::after {
				opacity: 1;
				scale: 1 1.075;
				transition: 0.05s;
			}
		}
	}

	.channel {
		background: utils.$color-gray;
		mask: url('./channel_mask.png');
		mask-size: 100% 100%;
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;

		.content {
			position: absolute;
			inset: 0.25rem;
			background: white;
			mask: url('./channel_mask.png');
			mask-size: 100% 100%;
		}
	}
</style>
