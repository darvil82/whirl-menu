<script lang="ts">
	import { menuTraysHandler, type TrayAnimation } from '$lib/scripts/menu/tray.svelte';
	import type { Snippet } from 'svelte';

	const props: { position: 'left' | 'right' } = $props();

	const ANIMATIONS: { [anim in Exclude<TrayAnimation, 'none'>]: [string, string] } = {
		rotate: ['rotate-1', 'rotate-2'],
		slide: ['slide-out', 'slide-in']
	};

	let data = $derived(menuTraysHandler.getData(props.position));
	let element: HTMLDivElement = $state()!;
	let snippet: Snippet | undefined = $state(undefined);
	let animating = false;

	function animateStartEnd(start: string, end: string) {
		animating = true;
		element.classList.add(start);
		element.addEventListener(
			'animationend',
			() => {
				snippet = data?.content;

				element.classList.remove(start);
				element.classList.add(end);
				element.addEventListener(
					'animationend',
					() => {
						element.classList.remove(end);
						animating = false;
					},
					{ once: true }
				);
			},
			{ once: true }
		);
	}

	function animate(anim: keyof typeof ANIMATIONS) {
		const [start, end] = ANIMATIONS[anim];
		animateStartEnd(start, end);
	}

	$effect(() => {
		if (data === undefined) return;

		if (data.animation === 'none' || animating) {
			snippet = data?.content;
			return;
		}

		animate(data.animation);
	});
</script>

<div
	bind:this={element}
	class={`tray ${props.position}`}
	class:hidden={data?.content === undefined}
>
	{@render snippet?.()}
</div>

<style lang="scss">
	.tray {
		--translation: -7rem;
		--slide-percentage: -100%;
		--origin-offset: 0%;

		display: flex;
		gap: 1rem;
		padding: 1vh;

		border: 0.5rem solid rgba(240, 240, 240, 0.466);
		filter: drop-shadow(0.5rem 0.5rem rgba(0, 0, 0, 0.24));
		translate: var(--translation);
		transform-origin: calc(var(--origin-offset) + var(--translation) / 2) center;

		&.hidden {
			visibility: hidden;
		}

		&.left {
			justify-content: end;
			padding-left: 10vw;
			border-top-right-radius: 10vh;
			border-bottom-right-radius: 10vh;
			border-left: none;
		}

		&.right {
			--translation: 7rem;
			--origin-offset: 100%;
			--slide-percentage: 100%;
			border-right: none;
			padding-right: 10vw;
			border-top-left-radius: 10vh;
			border-bottom-left-radius: 10vh;
		}

		&.rotate-1 {
			animation: rotate-q2 0.33s forwards linear;

			&.right {
				animation-name: rotate-q1;
			}
		}

		&.rotate-2 {
			animation: rotate-q1 0.33s forwards linear;

			&.right {
				animation-name: rotate-q2;
			}
		}

		&.slide-out {
			animation: slide-out 0.33s forwards linear;

			&.right {
				animation-name: slide-in;
			}
		}

		&.slide-in {
			animation: slide-in 0.33s forwards linear;

			&.right {
				animation-name: slide-out;
			}
		}

		&.right {
			animation-direction: reverse;
		}

		@keyframes slide-out {
			to {
				transform: translateX(var(--slide-percentage));
			}
		}

		@keyframes slide-in {
			from {
				transform: translateX(var(--slide-percentage));
			}
			to {
				transform: translateX(0%);
			}
		}

		@keyframes rotate-q1 {
			from {
				rotate: -90deg;
			}
			to {
				rotate: 0deg;
			}
		}

		@keyframes rotate-q2 {
			from {
				rotate: 0deg;
			}
			to {
				rotate: 90deg;
			}
		}
	}
</style>
