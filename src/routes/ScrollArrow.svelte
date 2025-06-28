<script lang="typescript">
	import { onMount, type Snippet } from 'svelte';
	import { PAGE_SCROLL_DELAY } from '$lib/channels/channel_utils';
	import { movingChannel } from '../lib/channels/channels_status.svelte';

	const {
		show = true,
		onclick: _onclick,
		position,
		children
	}: {
		show?: boolean;
		onclick: (e: MouseEvent | undefined) => void;
		position: 'left' | 'right';
		children?: Snippet;
	} = $props();

	let clicked = $state(false);
	let isHovering = $state(false);
	let hoverInterval: number | undefined;

	function onclick(event: MouseEvent | undefined) {
		if (event && event.button !== 0) return;
		if (clicked) return;

		clicked = true;
		_onclick?.(event);
		setTimeout(() => (clicked = false), PAGE_SCROLL_DELAY);
	}

	function hoverAutoClick() {
		if (isHovering && movingChannel.isMoving) {
			onclick(undefined);
		}
	}

	function onmouseover() {
		if (isHovering) return;

		isHovering = true;
		hoverInterval = setInterval(hoverAutoClick, PAGE_SCROLL_DELAY + 25); // 25ms to ensure it doesn't trigger too early
	}

	function onmouseleave() {
		isHovering = false;
		clearInterval(hoverInterval);
	}
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<button
	class={`arrow-wrapper ${position}`}
	onmousedown={onclick}
	{onmouseover}
	{onmouseleave}
	class:show
	class:clicked
	aria-label={`move ${position}`}
>
	<div class="arrow"></div>
	<div class="move-indicator">
		{#if children}
			<span>{@render children()}</span>
		{/if}
	</div>
</button>

<style lang="scss">
	.arrow-wrapper {
		position: fixed;
		top: calc(
			50% - 10vh
		); // they're not positioned inside the actual channel pannel so we gotta do this
		translate: 0 -50%;
		z-index: 1000;
		scale: 0.8;
		transition:
			transform 0.25s,
			visibility 0.5s;

		--pos: 2.5vw;
		--pos-2: calc(var(--pos) + 0.5vw);

		// hitbox
		&::before {
			content: '';
			position: absolute;
			inset: -50% -120%;
			// outline: red 0.2em solid;
		}

		.move-indicator {
			position: absolute;
			line-height: 0.8;
			color: #777;
			font-weight: bold;
			right: 3vh;
			top: -3vh;
			width: 17vh;
			height: 17vh;
			background:
				radial-gradient(at var(--highlight-pos, 25%) 25%, white 20%, transparent 45%),
				radial-gradient(at 50% 50%, $color-light 40%, $color-gray);
			border-radius: 50%;
			border: highlight-border(0.4rem);
			visibility: hidden;
			transform-origin: right center;
			scale: 0.4;
			transition:
				scale 0.05s linear,
				visibility 0.05s linear;

			span {
				font-size: 17vh;
				line-height: 0.65;
			}
		}

		.arrow {
			width: 5vh;
			height: 11vh;
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
			animation: arrow-anim-right 0.5s infinite alternate;

			&:not(.show) {
				transform: translateX(20rem);
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
				transform: scaleX(-1) translateX(20rem);
				visibility: hidden;
			}

			animation: arrow-anim-left 0.5s infinite alternate;

			@keyframes arrow-anim-left {
				to {
					left: var(--pos-2);
				}
			}
		}

		&.show:hover,
		&.show.clicked {
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

			&::before {
				left: -400%;
			}
		}

		&.clicked .move-indicator {
			animation: clicked 0.5s forwards;

			@keyframes clicked {
				20% {
					filter: brightness(2.25);
				}
				30% {
					filter: brightness(2.1);
				}
				100% {
					filter: brightness(1);
				}
			}
		}
	}
</style>
