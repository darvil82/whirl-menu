<script lang="typescript">
	import { onMount } from 'svelte';
	import SOUNDS, { playSound } from '$lib/sounds/sounds';
	import ChannelGrid from './ChannelGrid.svelte';
	import ChannelPanelArrow from './ChannelPanelArrow.svelte';
	import { MAX_PAGES, PAGE_SCROLL_DELAY } from './channels_def';

	let currentTime: string[] = $state(getTime());
	let appsOffset: string = $state('0px');
	let currentPage: number = $state(0);
	let lastMoveDir: undefined | 'left' | 'right' = $state();

	let scrollingPage = $state(false);

	function getTime(): string[] {
		const date = new Date();
		return [date.getHours().toString(), date.getMinutes().toString().padStart(2, '0')];
	}

	function scrollChannels(direction: 'left' | 'right') {
		if (scrollingPage) return;

		const newPage = currentPage + (direction == 'right' ? 1 : -1);
		if (newPage < 0 || newPage >= MAX_PAGES) return;

		lastMoveDir = direction;
		scrollingPage = true;
		appsOffset = -100 * newPage + '%';
		playSound(SOUNDS.CHANNEL.move_page);

		setTimeout(() => {
			scrollingPage = false;
			currentPage = newPage;
		}, PAGE_SCROLL_DELAY);
	}

	function getHideGridValue(at: number): 'all' | 'left' | 'right' | undefined {
		if (at == currentPage) return undefined;

		if (lastMoveDir == 'right' && scrollingPage) {
			if (at == currentPage + 1) return undefined;
			if (at == currentPage + 2) return 'right';
		}

		if (lastMoveDir == 'left' && scrollingPage) {
			if (at == currentPage - 1) return undefined;
			if (at == currentPage - 2) return 'left';
		}

		if (at == currentPage + 1) return 'right';
		if (at == currentPage - 1) return 'left';

		return 'all';
	}

	function onScrollHotkeys(e: KeyboardEvent) {
		if (e.key == '+') scrollChannels('right');
		else if (e.key == '-') scrollChannels('left');
	}

	onMount(() => {
		const timer = setInterval(() => {
			currentTime = getTime();
		}, 1000 * 5);

		document.addEventListener('keydown', onScrollHotkeys);

		return () => {
			clearInterval(timer);
			document.removeEventListener('keydown', onScrollHotkeys);
		};
	});
</script>

<div class="channel-panel" style:--grid-translate={appsOffset}>
	<div class="channels">
		<ChannelPanelArrow
			position={'left'}
			show={currentPage > 0}
			onclick={() => scrollChannels('left')}>-</ChannelPanelArrow
		>
		<div class="channels-wrapper">
			{#each new Array(MAX_PAGES) as _, page}
				<ChannelGrid {page} hide={getHideGridValue(page)}></ChannelGrid>
			{/each}
		</div>

		<ChannelPanelArrow
			position={'right'}
			show={currentPage < MAX_PAGES - 1}
			onclick={() => scrollChannels('right')}>+</ChannelPanelArrow
		>
	</div>

	<div
		class="time-wrapper"
		class:right={scrollingPage && lastMoveDir == 'right'}
		class:left={scrollingPage && lastMoveDir == 'left'}
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
	}

	.channels {
		position: relative;
		display: flex;
		align-self: stretch;
		justify-content: start;
		background: $background-repeating-gradient;
		outline: highlight-border();
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
			animation: move-right 0.5s;
		}

		&.left {
			translate: -100%;
			animation: move-left 0.5s;
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
		$border-thickness: 0.25rem;
		filter: drop-shadow($border-thickness 0rem 0rem $color-highlight-blue)
			drop-shadow(0rem $border-thickness 0rem $color-highlight-blue)
			drop-shadow(0rem - $border-thickness 0rem $color-highlight-blue);

		&::before,
		&::after {
			content: '';
			position: absolute;
			inset-block: 0;
			background: $background-repeating-gradient;
			clip-path: url('./channel_panel_mask.svg#mask');
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
</style>
