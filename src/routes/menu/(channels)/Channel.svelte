<script lang="typescript">
	import SOUNDS from '$lib/assets/sounds/soundsDefinition';
	import DefaultThumbnail from '$lib/custom/channels/defs/defaultThumbnail/DefaultThumbnail.svelte';
	import type { DragContext } from '$lib/scripts/draggables.svelte';
	import type {
		ChannelThumbnailData,
		RuntimeChannel
	} from '$lib/scripts/menu/channels/runtimeChannel';
	import { Menu } from '$lib/scripts/menu/menu';
	import { SimpleSound } from '$lib/scripts/sound';
	import { type AnchorPosition } from '$lib/scripts/utils.svelte';
	import { onMount } from 'svelte';

	let {
		channel,
		bubblePosition,
		position,
		moving
	}: {
		channel?: RuntimeChannel;
		bubblePosition: AnchorPosition;
		position: [number, number];
		moving: boolean;
	} = $props();

	let dragging = $state(false);
	let crtAnimation = $state(false);
	let channelElement: HTMLButtonElement;

	function hover() {
		if ((channel !== undefined) != !Menu.instance().channels.draggableEnvironment.isDragging)
			return;
		SimpleSound.play(SOUNDS.BUTTON.hover);
	}

	function onClick(e: MouseEvent) {
		if (dragging || !channel || crtAnimation || moving) return;

		SimpleSound.play(SOUNDS.BUTTON.click2);
		Menu.instance().channels.storage.refreshDOMRects();
		Menu.instance().channels.zoomed.set(channel);
	}

	function onDrag(ctx: DragContext<RuntimeChannel>) {
		if (!channel || channel.locked || crtAnimation) {
			ctx.deny();
			return;
		}

		dragging = true;
		SimpleSound.play(SOUNDS.CHANNEL.hold);
		ctx.accept(channel);
		channel = undefined;
	}

	function onDropOutside(ctx: DragContext<RuntimeChannel>) {
		channel = ctx.extraData!;
		dragging = false;
		channel.position = position;
		SimpleSound.play(SOUNDS.MISC.error);
	}

	function onDrop(ctx: DragContext<RuntimeChannel>) {
		if (channel || crtAnimation) {
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

		dragging = false;
		Menu.instance().channels.storage.updateAndSave(newChannel, (c) => {
			c.position = position;
		});
		ctx.accept();
	}

	function getChannelThumbnailData(): ChannelThumbnailData {
		return {
			optimized: Menu.instance().channels.zoomed.bannerShown || moving
		};
	}

	onMount(() => {
		const unsubDragger = Menu.instance().channels.draggableEnvironment.registerDragger({
			element: channelElement,
			onClick,
			onDrag,
			onDropOutside
		});
		const unsubDropper = Menu.instance().channels.draggableEnvironment.registerDroppable({
			element: channelElement,
			onDrop
		});

		return () => {
			unsubDragger();
			unsubDropper();
		};
	});
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<button
	bind:this={channelElement}
	class="channel-wrapper"
	class:active={(channel != undefined) != Menu.instance().channels.draggableEnvironment.isDragging}
	class:other-moving={Menu.instance().channels.draggableEnvironment.isDragging && channel}
	onmouseover={hover}
>
	<div class="content" class:crt-animation={crtAnimation}>
		{#if channel && !dragging}
			<channel.thumbnail {...getChannelThumbnailData()} />
		{:else}
			<DefaultThumbnail {...getChannelThumbnailData()} />
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
			filter: brightness(0.72);
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
