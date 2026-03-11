<script lang="typescript">
	import { ButtonBehavior, type ButtonProps } from './base.svelte';

	const props: ButtonProps = $props();
	const behavior = new ButtonBehavior(() => props);
</script>

<button
	bind:this={behavior.element}
	class:clicked={behavior.isClicked}
	class:no-border={behavior.props.noBorder}
	class:disabled={behavior.props.disabled}
>
	{@render behavior.props.children()}
	<div class="button-effect"></div>
</button>

<style lang="scss">
	@use './base.scss';

	button {
		font-size: 1.6em;
		padding: 0.7em 2.1em;
		border-radius: 50em;
		color: #464646;
		background: #e3e8ef;
		box-shadow: inset 0 0 0.25em 0.2em #bcc8d8;
		position: relative;
		isolation: isolate;

		&:not(.no-border) {
			border: highlight-border();
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

		.button-effect {
			border-radius: inherit;
			position: absolute;
			inset: 0;
			background: white;
			opacity: var(--button-effect-opacity);
		}
	}
</style>
