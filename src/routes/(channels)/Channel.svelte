<script lang="typescript">
	import SOUNDS, { SimpleSound } from '$lib/assets/sounds/sounds';
	import type { DragContext } from '$lib/scripts/draggables.svelte';
	import { balloon, type AnchorPosition } from '$lib/scripts/utils.svelte';
	import { onMount } from 'svelte';
	import { channels, Channels, type RuntimeChannel } from '../../lib/channels/channel_utils';
	import { movingChannels, selectedChannel } from '../../lib/channels/channels_status.svelte';
	import DefaultThumbnail from '../../lib/channels/defs/default_thumbnail/DefaultThumbnail.svelte';

	let {
		channel,
		bubblePosition,
		position
	}: {
		channel?: RuntimeChannel;
		bubblePosition: AnchorPosition;
		position: [number, number];
	} = $props();

	let moving = $state(false);
	let crtAnimation = $state(false);
	let channelElement: HTMLButtonElement;

	function hover() {
		if ((channel !== undefined) != !movingChannels.isDragging) return;
		SimpleSound.play(SOUNDS.BUTTON.hover);
	}

	function onClick(e: MouseEvent) {
		if (moving || !channel || crtAnimation) return;

		SimpleSound.play(SOUNDS.BUTTON.click2);
		Channels.refreshDOMRects();
		selectedChannel.set(channel);
	}

	function onDrag(ctx: DragContext<RuntimeChannel>) {
		if (channel?.locked || !channel) {
			ctx.deny();
			return;
		}

		moving = true;
		SimpleSound.play(SOUNDS.CHANNEL.hold);
		ctx.accept(channel);
		channel = undefined;
	}

	function onDropOutside(ctx: DragContext<RuntimeChannel>) {
		channel = ctx.extraData!;
		moving = false;
		channel.position = position;
		SimpleSound.play(SOUNDS.MISC.error);
	}

	function onDrop(ctx: DragContext<RuntimeChannel>) {
		if (channel) {
			ctx.deny();
			return;
		}

		const newChannel = ctx.extraData!;
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
		ctx.accept();
	}

	onMount(() => {
		const unsubDragger = movingChannels.registerDragger({
			element: channelElement,
			onClick,
			onDrag,
			onDropOutside
		});
		const unsubDropper = movingChannels.registerDroppable({ element: channelElement, onDrop });

		return () => {
			unsubDragger();
			unsubDropper();
		};
	});
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<button
	bind:this={channelElement}
	{@attach balloon(channel?.name ?? '', channel !== undefined && !movingChannels.isDragging, {
		anchor: bubblePosition
	})}
	class="channel-wrapper"
	class:active={(channel != undefined) != movingChannels.isDragging}
	class:other-moving={movingChannels.isDragging && channel}
	onmouseover={hover}
>
	<div class="content" class:crt-animation={crtAnimation}>
		{#if channel && !moving}
			<channel.thumbnail />
		{:else}
			<DefaultThumbnail />
		{/if}
	</div>
</button>

<style lang="scss">
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

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: url('$lib/assets/images/channels/channel_mask_lr.png');
			background-size: 100% 100%;
			filter: brightness(0.75);
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

	.content {
		position: absolute;
		inset: 0.4vh;
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
</style>
