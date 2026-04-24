<script lang="ts">
	import { Menu } from '$lib/scripts/menu/menu';
	import { type Snippet } from 'svelte';

	const props: { position: 'left' | 'right' } = $props();

	let data = $derived(Menu.instance().trays.getData(props.position));
	let element: HTMLDivElement = $state()!;
	let snippet: Snippet | undefined = $state(undefined);
	let animating = $state(false);

	$effect(() => {
		if (data === undefined) return;

		if (data.animation === 'none' || animating) {
			snippet = data?.content;
			return;
		}
	});
</script>

<div
	bind:this={element}
	class={`tray ${props.position}`}
	class:hidden={data?.content === undefined}
	class:animating
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

		&.animating {
			pointer-events: none;
		}
	}
</style>
