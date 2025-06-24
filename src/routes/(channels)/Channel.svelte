<script lang="typescript">
	import DefaultThumbnail from '../../lib/channels_def/default_thumbnail/DefaultThumbnail.svelte';
	import SOUNDS, { playSound } from '$lib/sounds/sounds';
	import type { ChannelDef } from '../../lib/channels_def/channels_def';
	import { debounce, ellipsize } from '$lib/utils.svelte';
	import { movingChannel, selectedChannel } from './channels_status.svelte';
	import ORIGINAL_CHANNELS, { channels, updateChannel } from '../../lib/channels_def/channels_def';

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
	let showTitle = $state(false);
	let moving = $state(false);
	let crtAnimation = $state(false);
	let element: HTMLButtonElement;

	function hover() {
		if (movingChannel.isMoving) {
			playSound(SOUNDS.BUTTON.hover);
			return;
		}

		if (!channel) return;

		playSound(SOUNDS.BUTTON.hover);

		hoverTimeout = setTimeout(() => {
			showTitle = true;
			playSound(SOUNDS.MISC.balloon);
		}, 350);
	}

	function stopHover() {
		clearTimeout(hoverTimeout);
		showTitle = false;
	}

	const onclick = debounce((e: MouseEvent) => {
		if (moving || !channel || crtAnimation) return;

		if (e.buttons == 3) {
			moving = true;
			stopHover(); // stop hover to prevent title from inmediately popping up if dropping on same place
			movingChannel.set({ channel, originalCallback: receiveChannelData });
			playSound(SOUNDS.CHANNEL.hold);
			channel = undefined;
		} else if (e.buttons == 1) {
			playSound(SOUNDS.BUTTON.click2);
			selectedChannel.set({ channel, boundingRect: element.getBoundingClientRect() });
			stopHover();
		}
	}, 50);

	function receiveChannelData(c: ChannelDef, animate: boolean = false) {
		if (!animate) {
			channel = c;
			moving = false;
			c.position = position;
			return;
		}

		crtAnimation = true;
		playSound(SOUNDS.CHANNEL.drop, 0.5);

		setTimeout(() => {
			channel = c;
		}, 500);

		setTimeout(() => {
			crtAnimation = false;
		}, 750);

		moving = false;
		c.position = position;
		updateChannel(c.id, (c) => (c.position = position));
	}

	function onStopClick(e: MouseEvent) {
		if (movingChannel.isMoving && !channel) {
			receiveChannelData(movingChannel.channel!, true);

			movingChannel.unset();
			e.stopPropagation();
		}
	}
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<button
	bind:this={element}
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
		<div class="content" class:crt-animation={crtAnimation}>
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
		mask: url('assets/channel_mask.png');
		mask-size: 100% 100%;
		position: absolute;
		inset: 0;
		overflow: hidden;

		.content {
			position: absolute;
			inset: 0.25rem;
			background: white;
			mask: url('assets/channel_mask.png');
			mask-size: 100% 100%;
			transition: filter 0.25s;

			// crt animation effect
			&::before {
				content: '';
				position: absolute;
				inset: 0;
				background-color: white;
				z-index: 1;
				visibility: hidden;

				@keyframes crt {
					0% {
						visibility: visible;
						scale: 0.1 0.1;
						opacity: 0;
					}
					15% {
						scale: 0.1 0.8;
						opacity: 1;
					}
					30% {
						scale: 1 0.1;
						opacity: 1;
					}
					45% {
						scale: 1 1;
						opacity: 1;
					}
					75% {
						opacity: 1;
					}
					100% {
						opacity: 0;
					}
				}
			}

			&.crt-animation::before {
				animation: crt 0.75s forwards;
			}
		}
	}

	.channel-wrapper {
		position: relative;

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			mask: url('assets/channel_hover_mask.png');
			mask-size: 100% 100%;
			background: $color-highlight-blue;
			opacity: 0;
			scale: 0.9;
			transition: 0.5s ease-in;
		}

		&.active {
			&:hover::after {
				opacity: 0.6;
				scale: 1 1.08;
				transition: 0.05s;
			}
		}

		&.other-moving .content {
			filter: brightness(0.5) contrast(0.75);
		}

		*,
		&::after {
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
