<script lang="typescript">
	import SOUNDS, { SimpleSound } from '$lib/assets/sounds/sounds';
	import { MAX_PAGES, PAGE_SCROLL_DELAY } from '$lib/channels/channel_utils';
	import { mouse } from '$lib/scripts/utils.svelte';
	import { onMount, untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import { movingChannel, selectedChannel } from '../../lib/channels/channels_status.svelte';
	import ChannelGrid from './ChannelGrid.svelte';

	let { currentPage = $bindable(0) } = $props();

	let currentTime: string[] = $state(getTime());
	let appsOffset: string = $state('0px');
	let lastMoveDir: undefined | 'left' | 'right' = $state();
	let scrolling = $state(false);
	let showWiiMenuText = $state(true);

	function getTime(): string[] {
		const date = new Date();
		return [date.getHours().toString(), date.getMinutes().toString().padStart(2, '0')];
	}

	export function scrollChannels(direction: 'left' | 'right') {
		if (scrolling) return;

		const newPage = currentPage + (direction === 'right' ? 1 : -1);
		if (newPage < 0 || newPage >= MAX_PAGES) return;

		lastMoveDir = direction;
		scrolling = true;
		appsOffset = -100 * newPage + '%';
		SimpleSound.play(SOUNDS.CHANNEL.scroll_page);

		setTimeout(() => {
			scrolling = false;
			currentPage = newPage;
		}, PAGE_SCROLL_DELAY);
	}

	function gotoPage(newPage: number) {
		if (scrolling || newPage == currentPage) return;

		if (newPage < 0 || newPage >= MAX_PAGES) return;

		lastMoveDir = undefined;
		appsOffset = -100 * newPage + '%';
		currentPage = newPage;
	}

	function getHideGridValue(at: number): 'all' | 'left' | 'right' | undefined {
		if (at == currentPage) return undefined;

		if (lastMoveDir == 'right' && scrolling) {
			if (at == currentPage + 1) return undefined;
			if (at == currentPage + 2) return 'right';
		}

		if (lastMoveDir == 'left' && scrolling) {
			if (at == currentPage - 1) return undefined;
			if (at == currentPage - 2) return 'left';
		}

		if (at == currentPage + 1) return 'right';
		if (at == currentPage - 1) return 'left';

		return 'all';
	}

	function onScrollHotkeys(e: KeyboardEvent) {
		if (movingChannel.isMoving || selectedChannel.isSelected) return;
		if (e.key == '+') scrollChannels('right');
		else if (e.key == '-') scrollChannels('left');
	}

	function onMouseUp() {
		if (!movingChannel.isMoving) return;

		// if this was called, a channel did not capture it. so it fell outside
		movingChannel.invokeOriginalCallback();
		movingChannel.set(undefined);
		SimpleSound.play(SOUNDS.MISC.error);
	}

	function onMouseMove() {
		if (!movingChannel.isMoving) return;
	}

	onMount(() => {
		const timer = setInterval(() => {
			currentTime = getTime();
		}, 5000);

		setTimeout(() => {
			showWiiMenuText = false;
		}, 3000);

		document.addEventListener('keydown', onScrollHotkeys);
		document.addEventListener('mouseup', onMouseUp);
		document.addEventListener('mousemove', onMouseMove);

		return () => {
			clearInterval(timer);
			document.removeEventListener('keydown', onScrollHotkeys);
			document.removeEventListener('mouseup', onMouseUp);
			document.removeEventListener('mousemove', onMouseMove);
		};
	});

	$effect(() => {
		if (selectedChannel.isSelected) untrack(() => gotoPage(selectedChannel.channel!.getPage()));
	});
</script>

{#snippet time()}
	{@const duration = 150}
	<div class="time">
		{#if showWiiMenuText}
			<div class="text-wii-menu" out:fade={{ duration }}>Wii Menu</div>
		{:else}
			<div class="text-clock" in:fade={{ duration, delay: duration * 2 }}>
				{currentTime[0]} <span class="colon">:</span>
				{currentTime[1]}
			</div>
		{/if}
	</div>
{/snippet}

{#if movingChannel.isMoving}
	<div
		class="moving-channel-indicator"
		style:left={mouse.position[0] + 'px'}
		style:top={mouse.position[1] + 'px'}
	></div>
{/if}
<div class="channel-panel" class:scrolling style:--grid-translate={appsOffset}>
	<div class="channels">
		<div class="channels-wrapper">
			{#each new Array(MAX_PAGES) as _, page}
				<ChannelGrid {page} hide={getHideGridValue(page)}></ChannelGrid>
			{/each}
		</div>
	</div>

	<div
		class="time-wrapper"
		class:right={scrolling && lastMoveDir == 'right'}
		class:left={scrolling && lastMoveDir == 'left'}
	>
		{@render time()}
		{@render time()}
	</div>
</div>

<style lang="scss">
	$border-thickness: 0.3rem;

	.channel-panel {
		display: flex;
		flex-direction: column;
		filter: drop-shadow(0px 0px 1.5em rgba(0, 0, 0, 0.5));

		&.scrolling {
			pointer-events: none;
		}
	}

	.channels {
		position: relative;
		display: flex;
		align-self: stretch;
		justify-content: start;
		background: $background-repeating-gradient;

		outline: highlight-border($border-thickness);
	}

	.channels-wrapper {
		display: flex;
		padding: min(8vh, 10rem);
		padding-inline: min(10vw, 20rem);
		padding-bottom: 1.5vh;
		width: 100%;
		flex-grow: 0;
	}

	.time-wrapper {
		display: flex;

		&.right {
			animation: move-right 0.49s;
		}

		&.left {
			translate: -100%;
			animation: move-left 0.49s;
		}

		@keyframes move-right {
			to {
				translate: -100%;
			}
		}

		@keyframes move-left {
			to {
				translate: 0;
			}
		}
	}

	.time {
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;

		width: 25vw;
		height: 9vh;
		margin-inline: calc(50% - 25vw / 2);
		position: relative;
		isolation: isolate;
		padding-bottom: 1.5vh;
		background: $background-repeating-gradient;
		filter: drop-shadow(0rem $border-thickness 0rem $color-highlight-blue);

		&::before,
		&::after {
			content: '';
			position: absolute;
			inset-block: 0;
			background: $background-repeating-gradient;
			clip-path: url('$lib/assets/images/channels/channel_panel_mask.svg#mask');
			z-index: -1;
		}

		&::before {
			left: -90%;
			right: 99%; // to fix weird artifact
		}

		&::after {
			left: 99%; // to fix weird artifact
			right: -90%;
			transform: scaleX(-1);
		}

		.text-clock {
			display: flex;
			width: 5.7ch;
			justify-content: flex-end;
			flex-shrink: 0;
			font-family: 'Segments';
			font-size: 7vh;
			color: $color-gray-dark;
			letter-spacing: 0.5rem;
			line-height: 1;
		}

		.text-wii-menu {
			font-size: 3.5vh;
			color: $color-highlight-blue;
			font-weight: bold;
			letter-spacing: 0.15rem;
			position: absolute;
			text-wrap: nowrap;
			top: 40%;
			left: 50%;
			translate: -50% -40%;
		}

		.colon {
			animation: blink 1s infinite alternate;
			// width: 1rem;

			@keyframes blink {
				0% {
					opacity: 0;
				}
				45% {
					opacity: 0;
				}
				55% {
					opacity: 1;
				}
				100% {
					opacity: 1;
				}
			}
		}
	}

	.moving-channel-indicator {
		mask-size: 100% 100%;
		translate: -50% -50%;
		filter: drop-shadow(0.75em 0.6em 0em rgba(0 0 0 / 0.15));
		width: 20vw;
		height: 20vh;
		position: fixed;
		z-index: 900;
		pointer-events: none;
		scale: 0.75;

		&::after {
			content: '';
			position: absolute;
			inset: -0.2rem;
			mask: url('$lib/assets/images/channels/channel_hover_mask_lr.png');
			mask-size: 100% 100%;
			background: white;
		}

		&::before {
			content: '';
			background: linear-gradient(
				to bottom,
				white -30%,
				$color-highlight-blue 40%,
				$color-highlight-blue 60%,
				white 130%
			);
			position: absolute;
			inset: 0;
			mask: url('$lib/assets/images/channels/channel_mask_lr.png');
			opacity: 0.8;
			mask-size: 100% 100%;
		}
	}
</style>
