<script lang="typescript">
	const {
		show,
		onmousedown,
		position
	}: { show: boolean; onmousedown: () => void; position: 'left' | 'right' } = $props();
</script>

<button
	class={`arrow-wrapper ${position}`}
	{onmousedown}
	class:show
	aria-label={`move ${position}`}
>
	<div class="arrow"></div>
	<div class="move-indicator"></div>
</button>

<style lang="scss">
	.arrow-wrapper {
		position: absolute;
		top: 50%;
		translate: 0 -50%;
		cursor: pointer;
		z-index: 5;
		transition:
			transform 0.25s,
			visibility 0.5s;

		--pos: 2rem;
		--pos-2: 2.5rem;

		.move-indicator {
			position: absolute;
			right: 1.8em;
			top: -1.25em;
			width: 8.5em;
			height: 8.5em;
			background:
				radial-gradient(at var(--highlight-pos, 25%) 25%, white 20%, transparent 45%),
				radial-gradient(at 50% 50%, $color-light 40%, $color-gray);
			border-radius: 50%;
			border: highlight-border();
			visibility: hidden;
			transform-origin: right center;
			scale: 0.4;
			transition:
				scale 0.05s linear,
				visibility 0.05s linear;
		}

		.arrow {
			width: 3em;
			height: 6em;
			clip-path: polygon(0 0, 100% 50%, 0 100%, 20% 50%);
			background-color: #1646a3;
			transform-origin: right;
			animation: arrow-expand 0.2s 0.05s;

			@keyframes arrow-expand {
				50% {
					scale: 0.7 1;
				}
				100% {
					scale: 1 1;
				}
			}

			@keyframes arrow-retract {
				50% {
					scale: 1 0.5;
				}
				100% {
					scale: 1 1;
				}
			}

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

			.move-indicator {
				--highlight-pos: 75%;
			}

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

		&.show:hover {
			.move-indicator {
				scale: 1;
				visibility: visible;
				transition:
					scale 0.05s 0.1s linear,
					visibility 0.05s 0.1s linear;
			}

			.arrow {
				animation: arrow-retract 0.15s;
			}
		}
	}
</style>
