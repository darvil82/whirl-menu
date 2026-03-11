<script lang="ts">
	import CircleButton from '$lib/components/button/CircleButton.svelte';

	const props: { position: 'left' | 'right' } = $props();
</script>

<div class="tray">
	<CircleButton>?</CircleButton>
</div>

<style lang="scss">
	.tray {
		--translation: -4vw;
		padding: 1vh;
		padding-left: 10vw;
		border-top-right-radius: 10vh;
		border-bottom-right-radius: 10vh;
		border: 0.5rem solid rgba(240, 240, 240, 0.466);
		border-left: none;
		filter: drop-shadow(0.5rem 0.5rem rgba(0, 0, 0, 0.24));
		translate: var(--translation);
		transform-origin: calc(var(--translation) / 2) center;

		@keyframes rotate-start {
			from {
				rotate: -90deg;
			}
			to {
				rotate: 0deg;
			}
		}

		@keyframes rotate-end {
			from {
				rotate: 0deg;
			}
			to {
				rotate: 90deg;
			}
		}

		&.enter {
			animation: rotate-start 0.5s linear forwards;
		}

		&.exit {
			animation: rotate-end 0.5s linear forwards;
		}
	}
</style>
