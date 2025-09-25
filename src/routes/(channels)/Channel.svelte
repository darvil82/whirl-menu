<script lang="typescript">
	import SOUNDS, { SimpleSound } from '$lib/assets/sounds/sounds';
	import { balloon, channelDragEnv, type AnchorPosition } from '$lib/utils.svelte';
	import { onMount } from 'svelte';
	import { Channels, channels, type RuntimeChannel } from '../../lib/channels/channel_utils';
	import { movingChannel, selectedChannel } from '../../lib/channels/channels_status.svelte';
	import DefaultThumbnail from '../../lib/channels/defs/default_thumbnail/DefaultThumbnail.svelte';

	let {
		channel,
		bubblePosition,
		hide,
		position
	}: {
		channel?: RuntimeChannel;
		bubblePosition: AnchorPosition;
		hide?: boolean;
		position: [number, number];
	} = $props();

	let moving = $state(false);
	let crtAnimation = $state(false);
	let element: HTMLButtonElement;

	function hover() {
		if ((channel !== undefined) != !movingChannel.isMoving) return;
		SimpleSound.play(SOUNDS.BUTTON.hover);
	}

	function onClick(e: MouseEvent) {
		if (moving || !channel || crtAnimation) return;

		SimpleSound.play(SOUNDS.BUTTON.click2);
		Channels.refreshDOMRects();
		selectedChannel.set(channel);
	}

	function onDrag(e: MouseEvent) {
		if (moving || !channel || crtAnimation || channel.locked) return false;

		moving = true;
		movingChannel.set({ channel, originalCallback: receiveChannelData });
		SimpleSound.play(SOUNDS.CHANNEL.hold);
		channel = undefined;
		return true;
	}

	function onDrop(e: MouseEvent) {
		if (!channel) {
			receiveChannelData(movingChannel.channel!, true);

			movingChannel.unset();
			e.stopPropagation();
			return true;
		}

		return false;
	}

	function receiveChannelData(newChannel: RuntimeChannel, animate: boolean = false) {
		if (!animate) {
			channel = newChannel;
			moving = false;
			newChannel.position = position;
			return;
		}

		crtAnimation = true;
		SimpleSound.play(SOUNDS.CHANNEL.drop, 0.5);

		setTimeout(() => {
			channel = newChannel;
		}, 500);

		setTimeout(() => {
			crtAnimation = false;
		}, 750);

		moving = false;
		channels.updateAndSave(newChannel, (c) => {
			c.position = position;
		});
	}

	onMount(() => {
		channelDragEnv.registerDraggable({ element, onDrag, onClick });
		channelDragEnv.registerDropZone({ element, onDrop });

		return () => {
			channelDragEnv.unregisterDraggable(element);
			channelDragEnv.unregisterDropZone(element);
		};
	});
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<button
	bind:this={element}
	{@attach balloon(channel?.name ?? '', channel !== undefined && !movingChannel.isMoving, {
		anchor: bubblePosition
	})}
	class="channel-wrapper"
	class:active={(channel != undefined) != movingChannel.isMoving}
	class:other-moving={movingChannel.isMoving && channel}
	onmouseover={hover}
	style:visibility={hide ? 'hidden' : undefined}
>
	<div class="channel">
		<div class="content" class:crt-animation={crtAnimation}>
			{#if channel && !moving}
				<channel.thumbnail />
			{:else}
				<DefaultThumbnail />
			{/if}
		</div>
	</div>
</button>

<style lang="scss">
	.channel {
		background: $color-gray;
		mask: url('$lib/assets/images/channels/channel_mask_lr.png');
		mask-size: 100% 100%;
		position: absolute;
		inset: 0;
		overflow: hidden;

		.content {
			position: absolute;
			inset: 0.25rem;
			background: white;
			mask: url('$lib/assets/images/channels/channel_mask_lr.png');
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
			mask: url('$lib/assets/images/channels/channel_hover_mask_lr.png');
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
			filter: brightness(0.8) contrast(0.5);
		}

		*,
		&::after {
			pointer-events: none;
		}
	}
</style>
