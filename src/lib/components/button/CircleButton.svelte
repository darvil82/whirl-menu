<script lang="typescript">
	import { onMount } from 'svelte';
	import { ButtonBehavior, type ButtonProps } from './base.svelte';

	const props: ButtonProps = $props();
	const behavior = new ButtonBehavior(() => props);

	onMount(() => behavior.detach);
</script>

<button
	bind:this={behavior.element}
	class:clicked={behavior.isClicked}
	class:no-border={behavior.props.noBorder}
	class:disabled={behavior.props.disabled}
>
	{@render behavior.props.children()}
</button>

<style lang="scss">
	@use './base.scss';

	button {
		position: relative;
		display: grid;
		place-items: center;
		color: #777;
		height: 15vh;
		aspect-ratio: 1;

		background:
			radial-gradient(at var(--highlight-pos, 25%) 25%, $color-light-dark 20%, transparent 45%),
			radial-gradient(at 50% 50%, $color-light-dark 45%, $color-gray 75%);
		border-radius: 50%;

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

		&::before {
			position: absolute;
			content: '';
			inset: 0;
			background: white;
			border-radius: inherit;
			opacity: var(--button-effect-opacity);
		}
	}
</style>
