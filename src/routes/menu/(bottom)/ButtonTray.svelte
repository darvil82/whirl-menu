<script lang="ts">
	import { menuTraysHandler } from './tray.svelte';

	const props: { position: 'left' | 'right' } = $props();

	let snippet = $derived(menuTraysHandler.getData(props.position)?.content);
</script>

<div class={`tray ${props.position}`} class:hidden={snippet === undefined}>
	{@render snippet?.()}
</div>

<style lang="scss">
	.tray {
		--translation: -4vw;
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
			--translation: 4vw;
			--origin-offset: 100%;
			border-right: none;
			padding-right: 10vw;
			border-top-left-radius: 10vh;
			border-bottom-left-radius: 10vh;
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
