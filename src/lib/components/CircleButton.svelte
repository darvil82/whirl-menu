<script lang="typescript">
	import type { Snippet } from 'svelte';

	const { children, onclick: _onclick }: { onclick?: (e: MouseEvent) => void; children: Snippet } =
		$props();
</script>

<button class="circle-button">
	{@render children()}
</button>

<style lang="scss">
	.circle-button {
		position: relative;
		display: grid;
		place-items: center;
		color: #777;
		font-weight: bold;
		width: 15vh;
		aspect-ratio: 1;

		background:
			radial-gradient(at var(--highlight-pos, 25%) 25%, $color-light-dark 20%, transparent 45%),
			radial-gradient(at 50% 50%, $color-light-dark 45%, $color-gray 75%);
		border-radius: 50%;
		border: highlight-border(0.35rem);
		transform-origin: right center;

		&::after {
			$side-offset: 1.25vh;
			position: absolute;
			content: '';
			background: rgba(255, 255, 255, 0.4);
			border-radius: 50%;
			width: 10.5vh;
			aspect-ratio: 1;
			top: $side-offset;
			left: $side-offset;
			mask: radial-gradient(circle at 0 0, white 60%, transparent 60%);
		}
	}
</style>
