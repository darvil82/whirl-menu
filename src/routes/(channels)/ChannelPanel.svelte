<script lang="typescript">
	import { onMount } from 'svelte';
	import SOUNDS, { playSound } from '$lib/sounds/sounds';
	import ChannelGrid from './ChannelGrid.svelte';
	import { loadChannels, MAX_PAGES, PAGE_SCROLL_DELAY } from '$lib/channels_def/channels_def';
	import { movingChannel, selectedChannel } from './channels_status.svelte';
	import { getMousePosition } from '$lib/utils.svelte';

	let { currentPage = $bindable(0) } = $props();

	let currentTime: string[] = $state(getTime());
	let appsOffset: string = $state('0px');
	let lastMoveDir: undefined | 'left' | 'right' = $state();
	let scrolling = $state(false);

	function getTime(): string[] {
		const date = new Date();
		return [date.getHours().toString(), date.getMinutes().toString().padStart(2, '0')];
	}

	export function scrollChannels(direction: 'left' | 'right') {
		if (scrolling) return;

		const newPage = currentPage + (direction == 'right' ? 1 : -1);
		if (newPage < 0 || newPage >= MAX_PAGES) return;

		lastMoveDir = direction;
		scrolling = true;
		appsOffset = -100 * newPage + '%';
		playSound(SOUNDS.CHANNEL.scroll_page);

		setTimeout(() => {
			scrolling = false;
			currentPage = newPage;
		}, PAGE_SCROLL_DELAY);
	}

	function gotoPage(newPage: number) {
		if (scrolling) return;

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
		if (movingChannel.isMoving) {
			// if this was called, a channel did not capture it. so it fell outside
			movingChannel.invokeOriginalCallback();
			movingChannel.set(undefined);
			playSound(SOUNDS.MISC.error);
		}
	}

	onMount(() => {
		const timer = setInterval(() => {
			currentTime = getTime();
		}, 1000 * 5);

		document.addEventListener('keydown', onScrollHotkeys);
		document.addEventListener('mouseup', onMouseUp);

		return () => {
			clearInterval(timer);
			document.removeEventListener('keydown', onScrollHotkeys);
			document.removeEventListener('mouseup', onMouseUp);
		};
	});
</script>

{#if movingChannel.isMoving}
	<div
		class="moving-channel-indicator"
		style:left={getMousePosition()?.[0] + 'px'}
		style:top={getMousePosition()?.[1] + 'px'}
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
		<div class="time">
			{currentTime[0]} <span class="colon">:</span>
			{currentTime[1]}
		</div>
		<div class="time">
			{currentTime[0]} <span class="colon">:</span>
			{currentTime[1]}
		</div>
	</div>
</div>

<style lang="scss">
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
		outline: highlight-border(0.2rem);
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

		font-size: 7vh;
		color: $color-gray-dark;
		font-family: 'DSEG7';
		letter-spacing: 0.5rem;
		line-height: 1;

		width: 25vw;
		margin-inline: calc(50% - 25vw / 2);
		position: relative;
		isolation: isolate;
		padding-bottom: 1.5vh;
		background: $background-repeating-gradient;
		$border-thickness: 0.2rem;
		filter: drop-shadow($border-thickness 0rem 0rem $color-highlight-blue)
			drop-shadow(0rem $border-thickness 0rem $color-highlight-blue)
			drop-shadow(0rem - $border-thickness 0rem $color-highlight-blue);

		&::before,
		&::after {
			content: '';
			position: absolute;
			inset-block: 0;
			background: $background-repeating-gradient;
			clip-path: url('assets/channel_panel_mask.svg#mask');
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

		.colon {
			animation: blink 1s infinite alternate;
			font-size: 8vh;

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
		background: linear-gradient(
			to bottom,
			white -20%,
			$color-highlight-blue 30%,
			$color-highlight-blue 70%,
			white 120%
		);
		mask: url('assets/channel_mask.png');
		mask-size: 100% 100%;
		translate: -50% -50%;
		width: 20vw;
		height: 20vh;
		position: fixed;
		z-index: 900;
		pointer-events: none;
		scale: 0.7;
		opacity: 0.9;

		&::after {
			content: '';
			position: absolute;
			inset: -0.2rem;
			mask: url('assets/channel_hover_mask.png');
			mask-size: 100% 100%;
			background: white;
		}
	}
</style>
