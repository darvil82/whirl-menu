<script lang="typescript">
	import { PAGE_SCROLL_DELAY } from '$lib/channels/channels';
	import { onMount } from 'svelte';
	import { movingChannels } from '../channels/channels_status.svelte';
	import CircleButton from './button/CircleButton.svelte';

	const {
		show = true,
		onclick: _onclick,
		position,
		onKeyDownPredicate
	}: {
		show?: boolean;
		onclick: (e?: MouseEvent) => void;
		position: 'left' | 'right';
		onKeyDownPredicate?: () => boolean;
	} = $props();

	let active = $state(false);
	let clicked = $state(false);
	let isHovering = false;
	let hoverInterval: number | undefined;
	let label: '+' | '-' = $derived(position === 'left' ? '-' : '+');

	function onclick(event?: MouseEvent | undefined) {
		if (event && event.button !== 0) return;
		if (active || !show) return;

		active = true;
		if (event) clicked = true;

		_onclick(event);
		setTimeout(() => {
			active = false;
			clicked = false;
		}, PAGE_SCROLL_DELAY);
	}

	function hoverAutoClick(e: MouseEvent) {
		if (isHovering && movingChannels.isDragging) {
			onclick(e);
		}
	}

	function onmouseover(e: MouseEvent) {
		if (isHovering) return;

		isHovering = true;
		hoverInterval = setInterval(() => hoverAutoClick(e), PAGE_SCROLL_DELAY + 25); // 25ms to ensure it doesn't trigger too early
	}

	function onmouseleave() {
		isHovering = false;
		clearInterval(hoverInterval);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key == label && (!onKeyDownPredicate || onKeyDownPredicate?.())) onclick();
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
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
		<!-- this is a hacky way of being able to easily apply two animations to the same thing -->
		<div class="wrapper">
			<CircleButton>
				<span>{label}</span>
			</CircleButton>
		</div>
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
			right: 3vh;
			top: -2vh;
			transform: scale(1.15);
			visibility: hidden;
			transform-origin: 100%;
			transition: visibility 0.05s linear;
			animation: hide-move-indicator 0.1s forwards;

			@keyframes hide-move-indicator {
				to {
					scale: 0.5;
				}
			}

			span {
				font-size: 14vh;
				translate: 0 -1.5vh;
			}

			.wrapper {
				position: relative;

				&::after {
					content: '';
					position: absolute;
					inset: 0;
					background-color: white;
					opacity: 0;
					border-radius: 50%;
				}
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
			transform: scaleX(-1); // invert the whole thing

			.move-indicator {
				--highlight-pos: 75%;
				transform: scale(-1.15, 1.15) translateX(100%); // invert it again so it looks normal
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
				visibility: visible;
				transition: visibility 0.05s 0.1s linear;
				animation: show-move-indicator 0.12s 0.1s forwards;

				@keyframes show-move-indicator {
					0% {
						scale: 0.5;
					}

					60% {
						scale: 1;
					}
					80% {
						scale: 0.95;
					}
					100% {
						scale: 1;
					}
				}
			}

			.arrow {
				animation: arrow-retract 0.15s;
			}

			&::before {
				left: -400%;
			}
		}

		&.clicked .move-indicator .wrapper::after {
			animation: clicked 0.5s forwards;

			@keyframes clicked {
				20% {
					opacity: 0.9;
				}
				40% {
					opacity: 1;
				}
				100% {
					opacity: 0;
				}
			}
		}
	}
</style>
