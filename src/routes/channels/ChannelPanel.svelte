<script lang="ts">
	import { onMount } from 'svelte';
	import Channel from './Channel.svelte';
	import CHANNELS from './channels_def/channels_def';

	let currentTime: string[] = $state(getTime());

	function getTime(): string[] {
		const date = new Date();
		return [date.getHours().toString(), date.getMinutes().toString().padStart(2, '0')];
	}

	function getChannelPosition(i: number): 'left' | 'right' | 'center' {
		if (i % 4 == 0) return 'left';
		if (i % 4 == 3) return 'right';
		return 'center';
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
		<div class="wrapper">
			<div class="channel-grid">
				{#each CHANNELS as channel, i}
					<Channel {channel} titlePosition={getChannelPosition(i)} />
				{/each}
				{#each new Array(12 - CHANNELS.length) as _, i}
					<Channel />
				{/each}
			</div>
			<div class="channel-grid">
				{#each new Array(12) as _, i}
					<Channel />
				{/each}
			</div>
		</div>
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
		background: utils.$background-repeating-gradient;
		outline: utils.highlight-border();
	}

	.wrapper {
		display: flex;
		padding: 5rem;
		padding-inline: min(10vw, 20rem);
		padding-bottom: 1.5vh;
		gap: 1rem;
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
		flex-shrink: 0;
	}

	.time {
		display: flex;
		justify-content: center;
		align-items: center;

		font-size: 6vh;
		color: utils.$color-gray-dark;
		font-family: 'DSEG7';
		letter-spacing: 0.5rem;
		line-height: 1;

		min-width: 30rem;
		position: relative;
		isolation: isolate;
		padding-bottom: 1.5vh;
		background: utils.$background-repeating-gradient;
		$border-thickness: 0.25rem;
		filter: drop-shadow($border-thickness 0rem 0rem utils.$color-highlight-blue)
			drop-shadow(0rem $border-thickness 0rem utils.$color-highlight-blue)
			drop-shadow(0rem - $border-thickness 0rem utils.$color-highlight-blue);

		&::before,
		&::after {
			content: '';
			position: absolute;
			inset-block: 0;
			background: utils.$background-repeating-gradient;
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
