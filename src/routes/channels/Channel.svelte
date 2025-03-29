<script lang="ts">
	import DefaultThumbnail from './channels_def/default_thumbnail/DefaultThumbnail.svelte';
	import SOUNDS, { playSound } from '$lib/sounds/sounds';
	import type { Channel } from './channels_def/channels_def';

	const {
		channel,
		titlePosition
	}: { channel?: Channel; titlePosition?: 'left' | 'right' | 'center' } = $props();

	let hoverTimeout: number;
	let focused = false;
	let showTitle = $state(false);

	function hover() {
		if (!channel || focused) return;

		playSound(SOUNDS.BUTTON.button_hover);
		focused = true;

		hoverTimeout = setTimeout(() => {
			showTitle = true;
			playSound(SOUNDS.CHANNEL.hover_title);
		}, 350);
	}

	function stopHover() {
		clearTimeout(hoverTimeout);
		showTitle = false;
		focused = false;
	}
</script>

<button
	class="wrapper"
	class:active={channel}
	onmouseover={hover}
	onmouseleave={stopHover}
	onfocus={hover}
	onfocusout={stopHover}
>
	<div class="channel">
		<div class="content">
			{#if channel}
				<channel.thumbnail />
			{:else}
				<DefaultThumbnail />
			{/if}
		</div>
	</div>
	<div class="hover-tag {titlePosition}" class:visible={showTitle}>{channel?.name}</div>
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

		* {
			pointer-events: none;
		}
	}

	.channel {
		background: $color-gray;
		mask: url('./channel_mask.png');
		mask-size: 100% 100%;
		position: absolute;
		inset: 0;
		overflow: hidden;

		.content {
			position: absolute;
			inset: 0.25rem;
			background: white;
			mask: url('./channel_mask.png');
			mask-size: 100% 100%;
		}
	}

	.hover-tag {
		position: absolute;
		top: calc(100% + 0.4rem);
		border-radius: 5rem;
		background: white;
		border: 3px solid $color-gray;
		padding: 1rem 2rem;
		font-size: 3.5vh;
		min-width: 35vh;
		box-shadow: 0.5rem 0.5rem 1rem rgba(0, 0, 0, 0.15);
		text-wrap: nowrap;
		z-index: 1;

		visibility: hidden;
		opacity: 0;
		scale: 0.9;
		transition: all 0.15s;

		&.left {
			right: auto;
			left: 0;
		}

		&.right {
			left: auto;
			right: 0;
		}

		&.center {
			left: 50%;
			transform: translateX(-50%);
			transform-origin: 0 0;
		}

		&.visible {
			opacity: 1;
			scale: 1;
			visibility: visible;
		}
	}
</style>
