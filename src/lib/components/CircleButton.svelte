<script lang="typescript">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const { children, ...extra }: HTMLButtonAttributes & { children: Snippet } = $props();
</script>

<button class="circle-button" {...extra}>
	{@render children()}
</button>

<style lang="scss">
	.circle-button {
		display: grid;
		place-items: center;
		color: #777;
		font-weight: bold;
		aspect-ratio: 1;
		width: 17vh;

		background:
			radial-gradient(at var(--highlight-pos, 25%) 25%, white 20%, transparent 45%),
			radial-gradient(at 50% 50%, $color-light 40%, $color-gray);
		border-radius: 50%;
		border: highlight-border(0.4rem);
		transform-origin: right center;
	}
</style>
