<script lang="ts">
	import { Menu } from '$lib/scripts/menu/menu';
	import type { TrayAnimation } from '$lib/scripts/menu/tray.svelte';
	import { type Snippet } from 'svelte';

	const props: { position: 'left' | 'right' } = $props();

	let data = $derived(Menu.instance().trays.getData(props.position));
	let element: HTMLDivElement = $state()!;
	let snippet: Snippet | undefined = $state(undefined);
	let animating = $state(false);

	type AnimationPair = [string, string];
	type AnimationSidePairs = { left: AnimationPair; right: AnimationPair } | AnimationPair;

	const ANIMATIONS: {
		[anim in Exclude<TrayAnimation, 'none'>]: AnimationSidePairs;
	} = {
		rotate: { left: ['rotate-1', 'rotate-2'], right: ['rotate-1-reversed', 'rotate-2-reversed'] },
		'rotate-reversed': {
			left: ['rotate-1-reversed', 'rotate-2-reversed'],
			right: ['rotate-1', 'rotate-2']
		},
		slide: ['slide-out', 'slide-in']
	};

	function animate(animation: string): Promise<void> {
		return new Promise((resolve) => {
			element.classList.add(animation);
			element.addEventListener(
				'animationend',
				() => {
					element.classList.remove(animation);
					resolve();
				},
				{ once: true }
			);
		});
	}

	function getAnimationPair(animation: keyof typeof ANIMATIONS): AnimationPair {
		const entry = ANIMATIONS[animation];

		if ('left' in entry && 'right' in entry) {
			return entry[props.position];
		}

		return entry;
	}

	async function replaceWithAnimation(newContent: Snippet, animation: keyof typeof ANIMATIONS) {
		const [start, end] = getAnimationPair(animation);

		animating = true;
		await animate(start);
		snippet = newContent;
		await animate(end);
		animating = false;
	}

	$effect(() => {
		if (data === undefined) return;

		if (data.animation === 'none') {
			snippet = data?.content;
			return;
		}

		replaceWithAnimation(data.content, data.animation);
	});
</script>

<div
	bind:this={element}
	class={`tray ${props.position}`}
	class:hidden={data?.content === undefined}
	class:animating
>
	<div class="content">
		{@render snippet?.()}
	</div>
</div>

<style lang="scss">
	.tray {
		--unit-scalar: 1;
		--side-inset: 5rem;
		--offset: 10vw;
		display: flex;
		gap: 1rem;
		padding: 1vh;

		border: 0.5rem solid rgba(240, 240, 240, 0.466);
		filter: drop-shadow(calc(0.5rem * var(--unit-scalar)) 0.5rem rgba(0, 0, 0, 0.24));
		justify-content: end;
		padding-left: 10vw;
		border-top-right-radius: 10vh;
		border-bottom-right-radius: 10vh;
		border-left: none;

		&.hidden {
			visibility: hidden;
		}

		&.left {
			transform-origin: calc(-1 * var(--offset)) center;
			transform: translate(calc(-1 * var(--side-inset)));
		}

		&.right {
			scale: -1 1;
			/* honestly just a bunch of calcs that seem to work, i barely understand this. with the scale applied, things behave funny.
			seems like multiplying the translation by 2 does exactly what i want. */
			transform-origin: calc(100% + var(--offset)) center;
			transform: translate(calc(100% + var(--offset) * 2 - var(--side-inset)));

			--unit-scalar: -1;

			.content {
				// keep the content fine since we inverted the whole thing hozriontally
				scale: -1 1;
			}
		}

		&.rotate-1 {
			animation: rotate-1 0.2s ease-in;
		}

		&.rotate-2 {
			animation: rotate-2 0.2s ease-out;
		}

		&.rotate-1-reversed {
			animation: rotate-2 0.2s reverse ease-out;
		}

		&.rotate-2-reversed {
			animation: rotate-1 0.2s reverse ease-in;
		}

		&.slide-in {
			animation: slide-in 0.2s linear;
		}

		&.slide-out {
			animation: slide-out 0.2s linear;
		}

		@keyframes rotate-1 {
			from {
				rotate: 0deg;
			}
			to {
				rotate: -90deg;
			}
		}

		@keyframes rotate-2 {
			from {
				rotate: 90deg;
			}
			to {
				rotate: 0deg;
			}
		}

		@keyframes slide-out {
			from {
				translate: 0%;
			}
			to {
				translate: calc(var(--unit-scalar) * -100%);
			}
		}

		@keyframes slide-in {
			from {
				translate: calc(var(--unit-scalar) * -100%);
			}
			to {
				translate: 0%;
			}
		}

		&.animating {
			pointer-events: none;
		}
	}
</style>
