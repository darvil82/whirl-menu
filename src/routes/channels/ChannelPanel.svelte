<script lang="typescript">
	import { onMount } from 'svelte';
	import Channel from './Channel.svelte';
	import CHANNELS from './channels_def/channels_def';
	import SOUNDS, { playSound } from '$lib/sounds/sounds';

	const MAX_PAGES = 2;

	let currentTime: string[] = $state(getTime());
	let appsOffset: string = $state('0px');
	let currentPage: number = $state(0);

	let disableScroll = false;

	function getTime(): string[] {
		const date = new Date();
		return [date.getHours().toString(), date.getMinutes().toString().padStart(2, '0')];
	}

	function getChannelPosition(i: number): 'left' | 'right' | 'center' {
		if (i % 4 == 0) return 'left';
		if (i % 4 == 3) return 'right';
		return 'center';
	}

	function scroll(direction: 'left' | 'right') {
		if (disableScroll) return;

		const newPage = currentPage + (direction == 'right' ? 1 : -1);
		if (newPage < 0 || newPage >= MAX_PAGES) return;

		disableScroll = true;
		appsOffset = -100 * newPage + '%';
		playSound(SOUNDS.CHANNEL.move_page);
		currentPage = newPage;

		setTimeout(() => {
			disableScroll = false;
		}, 500);
	}

	onMount(() => {
		const timer = setInterval(() => {
			currentTime = getTime();
		}, 1000 * 5);

		return () => clearInterval(timer);
	});
</script>

<div class="channel-panel">
	<div class="channels">
		<button
			class="arrow left"
			class:show={currentPage > 0}
			aria-label="move left"
			onclick={() => scroll('left')}
		></button>
		<div class="wrapper" style:--grid-translate={appsOffset}>
			<div class="channel-grid">
				{#each CHANNELS as channel, i}
					<Channel {channel} titlePosition={getChannelPosition(i)} />
				{/each}
				{#each new Array(12 - CHANNELS.length) as _, i}
					<Channel />
				{/each}
			</div>
			<div class="channel-grid">
				{#each new Array(12)}
					<Channel />
				{/each}
			</div>
		</div>
		<button
			class="arrow right"
			class:show={currentPage < MAX_PAGES - 1}
			aria-label="move right"
			onclick={() => scroll('right')}
		></button>
	</div>
	<div class="time">
		{currentTime[0]} <span class="colon">:</span>
		{currentTime[1]}
	</div>
</div>

<style lang="scss">
	.channel-panel {
		display: flex;
		flex-direction: column;
		align-items: center;
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

	.wrapper {
		display: flex;
		padding: 5rem;
		padding-inline: min(10vw, 20rem);
		padding-bottom: 1.5vh;
		width: 100%;
		flex-grow: 0;
	}

	.channel-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(3, 1fr);
		gap: 1rem;
		height: 60vh;
		width: 100%;
		padding-inline: 0.5rem;
		z-index: 1;
		flex-shrink: 0;
		translate: var(--grid-translate);
		transition: translate 0.5s;
	}

	.time {
		display: flex;
		justify-content: center;
		align-items: center;

		font-size: 6vh;
		color: $color-gray-dark;
		font-family: 'DSEG7';
		letter-spacing: 0.5rem;
		line-height: 1;

		min-width: 30rem;
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
