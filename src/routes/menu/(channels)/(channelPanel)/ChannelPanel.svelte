<script lang="typescript">
	import SOUNDS, { SimpleSound } from '$lib/assets/sounds/sounds';
	import { MAX_PAGES, PAGE_SCROLL_DELAY } from '$lib/scripts/menu/channels/runtimeChannel';
	import { Menu } from '$lib/scripts/menu/menu';
	import { mouse } from '$lib/scripts/mouse.svelte';
	import { untrack } from 'svelte';
	import ChannelGrid from '../ChannelGrid.svelte';
	import Time from './Time.svelte';

	let { currentPage = $bindable(0) }: { currentPage: number } = $props();

	let appsOffset: string = $state('0px');
	let lastMoveDir: undefined | 'left' | 'right' = $state();
	let scrolling = $state(false);
	let lifted = $state(false);

	export function lift(up: boolean) {
		lifted = up;
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

	$effect(() => {
		if (Menu.instance().channels.zoomed.isSelected)
			untrack(() => gotoPage(Menu.instance().channels.zoomed.channel!.getPage()));
	});
</script>

{#if Menu.instance().channels.draggableEnvironment.isDragging}
	<div
		class="moving-channel-indicator"
		style:left={mouse.position[0] + 'px'}
		style:top={mouse.position[1] + 'px'}
	></div>
{/if}
<div class:lifted class="channel-panel" class:scrolling style:--grid-translate={appsOffset}>
	<div class="channels">
		{#if !Menu.instance().channels.zoomed.fullyFocused}
			<div class="channels-wrapper">
				{#each new Array(MAX_PAGES) as _, page}
					<ChannelGrid {page} {scrolling} hide={getHideGridValue(page)} />
				{/each}
			</div>
		{/if}
	</div>

	<div
		class="time-wrapper"
		class:right={scrolling && lastMoveDir == 'right'}
		class:left={scrolling && lastMoveDir == 'left'}
	>
		<Time />
		<Time />
	</div>
</div>

<style lang="scss">
	$border-thickness: 0.3rem;

	.channel-panel {
		position: absolute;
		inset-inline: 0;
		display: flex;
		flex-direction: column;
		filter: drop-shadow(0px 0px 2.75rem rgba(0, 0, 0, 0.5));
		pointer-events: none;
		transition: translate 0.25s 0.3s ease-out;

		&.scrolling {
			pointer-events: none;
		}

		&.lifted {
			transition: translate 0.25s ease-out;
			translate: 0 -110%;
		}
	}

	.channels {
		position: relative;
		display: flex;
		align-self: stretch;
		justify-content: start;
		background: $background-repeating-gradient;
		pointer-events: all;

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
				white -20%,
				$color-highlight-blue 40%,
				$color-highlight-blue 60%,
				white 120%
			);
			position: absolute;
			inset: 0;
			mask: url('$lib/assets/images/channels/channel_mask_lr.png');
			opacity: 0.8;
			mask-size: 100% 100%;
		}
	}
</style>
