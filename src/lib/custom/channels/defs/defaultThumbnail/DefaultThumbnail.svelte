<script lang="typescript">
	import type { ChannelThumbnailData } from '$lib/channels/channels';

	const props: ChannelThumbnailData = $props();
</script>

<div class="default" class:optimize={props.optimized}>
	<div class="scrolling-effect" style:--start-offset={Math.random() * 60}></div>
	<div class="logo-text">Wii</div>
</div>

<style lang="scss">
	.default {
		$bg-1: #cfcfcf;
		$bg-2: #dadada;
		$highlight: #e6e6e6;

		position: absolute;
		inset: 0;
		isolation: isolate;
		display: grid;
		place-items: center;
		background: linear-gradient(to top, $bg-2, $bg-1 20%, $bg-1 90%, $highlight);

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			top: -100%;
			background: lines-repeating-gradient(transparent, $bg-2);
			animation: scroll 30s linear infinite;
			z-index: -1;

			@keyframes scroll {
				from {
					translate: 0 50%;
				}
				to {
					translate: 0 0;
				}
			}
		}

		&::after {
			content: '';
			position: absolute;
			inset: 0;
			mask: url('./noise_mask.png');
			mask-size: 200% 200%;
			mask-mode: luminance;
			background: rgba(44, 44, 44, 0.4);
			animation: move 0.85s steps(3) infinite;

			@keyframes move {
				0% {
					mask-position: -50% -50%;
				}
				25% {
					mask-position: 50% -50%;
				}
				50% {
					mask-position: 50% 50%;
				}
				75% {
					mask-position: -50% 50%;
				}
				100% {
					mask-position: -50% -50%;
				}
			}
		}

		.scrolling-effect {
			position: absolute;
			inset: 0;
			top: -200%;
			background: linear-gradient(
				to bottom,
				transparent,
				white 5%,
				transparent 10%,
				transparent 20%,
				white 26%,
				transparent 35%,
				transparent 45%,
				white 48%,
				transparent 53%,
				transparent 59%,
				white 64%,
				transparent 68%
			);
			animation: test 60s calc(var(--start-offset, 0) * -1s) linear infinite;
			opacity: 0.2;

			@keyframes test {
				from {
					translate: 0 100%;
				}
				to {
					translate: 0 0;
				}
			}
		}

		&.optimize {
			&::after,
			&::before,
			.scrolling-effect {
				animation-play-state: paused;
			}
		}
	}

	.logo-text {
		font-size: 5vh;
		font-weight: bold;
		color: rgba(170, 170, 170, 0.116);
		z-index: 1;
		scale: 1.3 1;
		text-shadow: 0 0 0.3rem currentColor;
	}
</style>
