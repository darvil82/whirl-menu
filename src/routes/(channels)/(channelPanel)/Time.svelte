<script lang="typescript">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const switchDuration = 150;
	let paddedTimeHack = $state(false); // pushes the time to the right to account for missing digit
	let currentTime: string[] = $state(getTime());
	let showWiiMenuText = $state(true);

	function getTime(): string[] {
		const date = new Date();

		if (date.getHours() < 10) paddedTimeHack = true;

		return [date.getHours().toString(), date.getMinutes().toString().padStart(2, '0')];
	}

	onMount(() => {
		const timer = setInterval(() => {
			currentTime = getTime();
		}, 5000);

		setTimeout(() => {
			showWiiMenuText = false;
		}, 3000);

		return () => {
			clearInterval(timer);
		};
	});
</script>

<div class="time">
	{#if showWiiMenuText}
		<div class="text-wii-menu" out:fade={{ duration: switchDuration }}>Wii Menu</div>
	{:else}
		<div
			class="text-clock"
			class:padded={paddedTimeHack}
			in:fade={{ duration: switchDuration, delay: switchDuration * 2 }}
		>
			{currentTime[0]} <span class="colon">:</span>
			{currentTime[1]}
		</div>
	{/if}
</div>

<style lang="scss">
	$border-thickness: 0.3rem;

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
			padding-left: 0.25ch;
			flex-shrink: 0;
			font-family: 'Segments';
			font-size: 7vh;
			color: $color-gray-dark;
			letter-spacing: 0.5rem;
			line-height: 1;

			&.padded {
				padding-left: 1.5ch;
			}
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
</style>
