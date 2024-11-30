<script lang="ts">
	import MenuButton from '$lib/components/MenuButton.svelte';
	import { onMount } from 'svelte';
	import Channel from './Channel.svelte';

	let currentTime: string = $state(getTime());

	function getTime(): string {
		const date = new Date();
		return date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0');
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
		<div class="channel-grid">
			{#each new Array(12) as _, i}
				<Channel></Channel>
			{/each}
		</div>
	</div>
	<div class="time">
		{currentTime}
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
		width: 100%;
		display: flex;
		justify-content: center;
		background: utils.$background-repeating-gradient;
		outline: utils.highlight-border();
	}

	.channel-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(3, 1fr);
		max-width: 80rem;
		width: 100%;
		grid-gap: 1rem;
		padding: 3rem;
		padding-bottom: 1rem;
	}

	.time {
		display: flex;
		justify-content: center;
		align-items: center;

		font-size: 4rem;
		color: utils.$color-gray-dark;
		font-family: 'DSEG7';
		letter-spacing: 0.5rem;
		line-height: 1;

		min-width: 20rem;
		position: relative;
		isolation: isolate;
		padding-block: 0.5rem 1.25rem;
		background: utils.$background-repeating-gradient;
		$test: 3px;
		filter: drop-shadow($test 0px 0px utils.$color-highlight-blue)
			drop-shadow(0px $test 0px utils.$color-highlight-blue)
			drop-shadow(0px - $test 0px utils.$color-highlight-blue);

		&::before,
		&::after {
			content: '';
			position: absolute;
			inset-block: 0;
			background: utils.$background-repeating-gradient;
			clip-path: url('./channel_panel_mask.svg#mask');
		}

		&::before {
			left: -100%;
			right: 100%;
		}

		&::after {
			left: 100%;
			right: -100%;
			transform: scaleX(-1);
		}
	}
</style>
