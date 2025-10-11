<div class="default">
	Wii
	<div class="scrolling-effect" style:--start-offset={Math.random() * 60}></div>
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
		font-size: 5vh;
		font-weight: bold;
		color: rgba(0, 0, 0, 0.04);
		background: linear-gradient(to top, $bg-2, $bg-1 20%, $bg-1 90%, $highlight);
		// background: $bg-1;

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
			mask-mode: luminance;
			background: rgba(44, 44, 44, 0.4);
			scale: 2;
			animation: move 0.75s steps(3) infinite;

			@keyframes move {
				0% {
					translate: -50% -50%;
				}
				25% {
					translate: 50% -50%;
				}
				50% {
					translate: 50% 50%;
				}
				75% {
					translate: -50% 50%;
				}
				100% {
					translate: -50% -50%;
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
	}
</style>
