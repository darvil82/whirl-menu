<script lang="typescript">
	import { onMount } from 'svelte';
	import CHANNELS, { type ChannelDef } from './channels_def/channels_def';
	import SOUNDS, { playSound } from '$lib/sounds/sounds';
	import ChannelGrid from './ChannelGrid.svelte';

	const MAX_PAGES = 4;

	let currentTime: string[] = $state(getTime());
	let appsOffset: string = $state('0px');
	let currentPage: number = $state(0);
	let lastMoveDir: undefined | 'left' | 'right' = $state();

	let moving = $state(false);

	function getTime(): string[] {
		const date = new Date();
		return [date.getHours().toString(), date.getMinutes().toString().padStart(2, '0')];
	}

	function scroll(direction: 'left' | 'right') {
		if (moving) return;

		const newPage = currentPage + (direction == 'right' ? 1 : -1);
		if (newPage < 0 || newPage >= MAX_PAGES) return;

		lastMoveDir = direction;
		moving = true;
		appsOffset = -100 * newPage + '%';
		playSound(SOUNDS.CHANNEL.move_page);

		setTimeout(() => {
			moving = false;
			currentPage = newPage;
		}, 500);
	}

	function getHideGridValue(at: number): 'all' | 'left' | 'right' | undefined {
		if (at == currentPage) return undefined;

		if (lastMoveDir == 'right' && moving) {
			if (at == currentPage + 1) return undefined;
			if (at == currentPage + 2) return 'right';
		}

		if (lastMoveDir == 'left' && moving) {
			if (at == currentPage - 1) return undefined;
			if (at == currentPage - 2) return 'left';
		}

		if (at == currentPage + 1) return 'right';
		if (at == currentPage - 1) return 'left';

		return 'all';
	}

	onMount(() => {
		const timer = setInterval(() => {
			currentTime = getTime();
		}, 1000 * 5);

		return () => clearInterval(timer);
	});
</script>

<div class="channel-panel" style:--grid-translate={appsOffset}>
	<div class="channels">
		<button
			class="arrow left"
			class:show={currentPage > 0}
			aria-label="move left"
			onclick={() => scroll('left')}
		></button>
		<div class="channels-wrapper">
			{#each new Array(MAX_PAGES) as _, page}
				<ChannelGrid {page} hide={getHideGridValue(page)}></ChannelGrid>
			{/each}
		</div>
		<button
			class="arrow right"
			class:show={currentPage < MAX_PAGES - 1}
			aria-label="move right"
			onclick={() => scroll('right')}
		></button>
	</div>

	<div
		class="time-wrapper"
		class:right={moving && lastMoveDir == 'right'}
		class:left={moving && lastMoveDir == 'left'}
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
		filter: drop-shadow(0px 0px 3rem rgba(0, 0, 0, 0.5));
	}

	.channels {
		display: flex;
		align-self: stretch;
		justify-content: start;
		background: $background-repeating-gradient;
		outline: highlight-border();

		.arrow {
			position: absolute;
			top: 50%;
			z-index: 2;
			translate: 0 -50%;
			transition:
				transform 0.5s,
				visibility 0.5s;

			width: 3rem;
			height: 6rem;
			clip-path: polygon(0 0, 100% 50%, 0 100%, 20% 50%);
			background-color: #1646a3;
			cursor: pointer;
			--pos: 2rem;
			--pos-2: 2.5rem;

			&::before {
				content: '';
				inset: 0;
				scale: 0.85;
				position: absolute;
				background:
					radial-gradient(at -50% 50%, #cff7ff 30%, transparent 60%),
					linear-gradient(to bottom, #4cd3fe 35%, #adf2ff 50%, #4cd3fe 65%);
				clip-path: inherit;
			}

			&.right {
				right: var(--pos);
				animation: arrow-anim-right 0.6s infinite alternate;

				&:not(.show) {
					transform: translateX(10rem);
					visibility: hidden;
				}

				@keyframes arrow-anim-right {
					to {
						right: var(--pos-2);
					}
				}
			}

			&.left {
				left: var(--pos);
				transform: scaleX(-1);

				&:not(.show) {
					transform: scaleX(-1) translateX(10rem);
					visibility: hidden;
				}

				animation: arrow-anim-left 0.6s infinite alternate;

				@keyframes arrow-anim-left {
					to {
						left: var(--pos-2);
					}
				}
			}
		}
	}

	.channels-wrapper {
		display: flex;
		padding: min(8vh, 4rem);
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

		font-size: 6vh;
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
			left: -120%;
			right: 99%; // to fix weird artifact
		}

		&::after {
			left: 99%; // to fix weird artifact
			right: -120%;
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
