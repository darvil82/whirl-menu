<script lang="ts">
	import SOUNDS, { playSound, type Sound } from '$lib/sounds/sounds';
	import type { Snippet } from 'svelte';

	const {
		children,
		disabled = false,
		onclick: _click,
		noBorder = false,
		clickSound = SOUNDS.BUTTON.button_click_default
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
		if (disabled || clicked) return;

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
		playSound(SOUNDS.BUTTON.button_hover);
	}
</script>

<button
	bind:this={btn}
	{disabled}
	onmousedown={onclick}
	onmouseover={hover}
	onfocus={hover}
	class:clicked
	class:no-border={noBorder}
>
	{@render children()}
</button>

<style lang="scss">
	button {
		font-size: 3rem;
		padding: 1.5rem 3.5rem;
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
			border: utils.$color-highlight-blue 0.25rem solid;
		}

		&::before {
			content: '';
			position: absolute;
			top: 0.4rem;
			inset-inline: 2rem;
			height: 2rem;
			background: #fff;
			border-radius: 50rem;
			z-index: -1;
		}

		&::after {
			$circle-size: 45%;
			content: '';
			position: absolute;
			top: 0.4rem;
			left: 0.5rem;
			height: 5rem;
			aspect-ratio: 1;
			background: radial-gradient(
				circle at 2.7rem 4.3rem,
				transparent,
				transparent $circle-size,
				#fff $circle-size
			);
			clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
			border-radius: 50rem;
			z-index: -1;
		}

		&:disabled {
			filter: grayscale(1) brightness(1.1) contrast(0.5);
			cursor: unset;
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

		&:not(:disabled):not(.clicked) {
			&:hover {
				scale: 1.1;
			}
		}
	}
</style>
