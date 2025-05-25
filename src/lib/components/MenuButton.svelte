<script lang="typescript">
	import SOUNDS, { playSound, type Sound } from '$lib/sounds/sounds';
	import { playSoundTimes } from '$lib/utils';
	import type { Snippet } from 'svelte';

	const {
		children,
		disabled = false,
		onclick: _click,
		noBorder = false,
		clickSound = SOUNDS.BUTTON.click_default
	}: {
		children: Snippet;
		disabled?: boolean;
		onclick?: () => void;
		noBorder?: boolean;
		clickSound?: Sound;
	} = $props();

	let clicked = $state(false);
	let btn: HTMLButtonElement;

	function onclick(event: MouseEvent) {
		if (event.button !== 0) return;
		if (clicked) return;

		if (disabled) {
			playSoundTimes(SOUNDS.BUTTON.error, 2, 90);
			return;
		}

		clicked = true;
		playSound(clickSound);
		_click?.();
		btn.addEventListener(
			'animationend',
			() => {
				clicked = false;
			},
			{ once: true }
		);
	}

	function hover() {
		if (disabled || clicked) return;
		playSound(SOUNDS.BUTTON.hover);
	}
</script>

<button
	bind:this={btn}
	onmousedown={onclick}
	onmouseover={hover}
	onfocus={hover}
	class:clicked
	class:no-border={noBorder}
	class:disabled
>
	{@render children()}
</button>

<style lang="scss">
	button {
		font-size: 1em;
		padding: 0.8em 2.15em;
		border-radius: 50rem;
		color: #464646;
		background: #e3e8ef;
		box-shadow: inset 0 0 1rem 0.5rem #bcc8d8;
		position: relative;
		isolation: isolate;
		cursor: pointer;
		transition:
			all 0.15s,
			filter 0.15s;

		&:not(.no-border) {
			border: $color-highlight-blue 0.25rem solid;
		}

		&::before {
			content: '';
			position: absolute;
			top: 0.2em;
			inset-inline: 1em;
			height: 0.82em;
			background: #fff;
			border-radius: 50rem;
			z-index: -1;
		}

		&::after {
			$circle-size: 45%;
			content: '';
			position: absolute;
			top: 0.2em;
			left: 0.3em;
			height: 2em;
			aspect-ratio: 1;
			background: radial-gradient(
				circle at 1.1em 1.75em,
				transparent,
				transparent $circle-size,
				#fff $circle-size
			);
			clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
			border-radius: 50rem;
			z-index: -1;
		}

		&.disabled {
			filter: grayscale(1) brightness(1.1) contrast(0.5);
		}

		&.clicked {
			animation: clicked 1s forwards;

			@keyframes clicked {
				5% {
					transform: scale(1);
				}
				20% {
					transform: scale(1.1);
					filter: brightness(1.2);
				}
				30% {
					transform: scale(1);
					filter: brightness(1.2);
				}
				100% {
					transform: scale(1);
					filter: brightness(1);
				}
			}
		}

		&:not(.disabled):not(.clicked) {
			&:hover {
				scale: 1.1;
			}
		}
	}
</style>
