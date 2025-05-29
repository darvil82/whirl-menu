<script lang="typescript">
	import DefaultThumbnail from './channels_def/default_thumbnail/DefaultThumbnail.svelte';
	import SOUNDS, { playSound } from '$lib/sounds/sounds';
	import type { ChannelDef } from './channels_def';
	import { ellipsize } from '$lib/utils.svelte';
	import { movingChannel } from './channels_status.svelte';

	let {
		channel,
		titlePosition,
		hide,
		position
	}: {
		channel?: ChannelDef;
		titlePosition?: 'left' | 'right' | 'center';
		hide?: boolean;
		position: [number, number];
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
		if (e.buttons == 3 && !moving && channel) {
			moving = true;
			movingChannel.set({ channel, originalCallback: receiveChannelData });
			channel = undefined;
		}
	}

	function receiveChannelData(c: ChannelDef) {
		moving = false;
		channel = c;
		c.position = position;
	}

	function onStopClick(e: MouseEvent) {
		if (movingChannel.isMoving && !channel) {
			receiveChannelData(movingChannel.channel!);

			movingChannel.unset();
			e.stopPropagation();
		}
	}
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<button
	class="channel-wrapper"
	class:active={(channel != undefined) != movingChannel.isMoving}
	class:other-moving={movingChannel.isMoving && channel}
	onmouseover={hover}
	onmouseleave={stopHover}
	onmousedown={onclick}
	onmouseup={onStopClick}
	style:visibility={hide ? 'hidden' : undefined}
>
	<div class="channel">
		<!-- <span class="debug">pos: {position}</span> -->
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
	.debug {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 1;
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
			transition: filter 0.25s;
		}
	}

	.channel-wrapper {
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
			&:hover::after {
				opacity: 1;
				scale: 1 1.06;
				transition: 0.05s;
			}
		}

		&.other-moving .content {
			filter: brightness(0.5) contrast(0.75);
		}

		* {
			pointer-events: none;
		}
	}

	.hover-tag {
		position: absolute;
		top: calc(100% + 0.4rem);
		border-radius: 5rem;
		background: white;
		border: 3px solid $color-gray;
		padding: 0.5em 1.25em;
		font-size: 3vh;
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
