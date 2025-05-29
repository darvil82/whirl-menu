<script lang="typescript">
	import DefaultThumbnail from './channels_def/default_thumbnail/DefaultThumbnail.svelte';
	import SOUNDS, { playSound } from '$lib/sounds/sounds';
	import type { ChannelDef } from './channels_def';
	import { ellipsize } from '$lib/utils';
	import { movingChannel } from './channels_status.svelte';

	let {
		channel,
		titlePosition,
		hide
	}: {
		channel?: ChannelDef;
		titlePosition?: 'left' | 'right' | 'center';
		hide?: boolean;
	} = $props();

	let hoverTimeout: number;
	let focused = false;
	let showTitle = $state(false);
	let moving = $state(false);

	function hover() {
		if (!channel || focused) return;

		playSound(SOUNDS.BUTTON.hover);
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

	function onclick(e: MouseEvent) {
		if (e.buttons == 3 && !moving) {
			moving = true;
			movingChannel.channel = channel;
			channel = undefined;
		}
	}

	function onstopclick(e: MouseEvent) {
		if (movingChannel.channel) {
			channel = movingChannel.channel;
			movingChannel.channel = undefined;
			moving = false;
		}
	}
</script>

<button
	class="wrapper"
	class:active={channel}
	onmouseover={hover}
	onmouseleave={stopHover}
	onmousedown={onclick}
	onmouseup={onstopclick}
	onfocus={hover}
	onfocusout={stopHover}
	style:visibility={hide ? 'hidden' : undefined}
>
	<div class="channel">
		<!-- <span class="debug-pos">{position}</span> -->
		<div class="content">
			{#if channel && !moving}
				<channel.thumbnail />
			{:else}
				<DefaultThumbnail />
			{/if}
		</div>
	</div>
	{#if !moving}
		<div class="hover-tag {titlePosition}" class:visible={showTitle}>
			{ellipsize(channel?.name ?? '', 25)}
		</div>
	{/if}
</button>

<style lang="scss">
	.debug-pos {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 1;
	}

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
				scale: 1 1.06;
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
		padding: 0.5em 1.25em;
		font-size: 3em;
		color: #555;
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
