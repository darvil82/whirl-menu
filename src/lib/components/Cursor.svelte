<script lang="typescript">
	import cursor_default from '$lib/assets/images/cursor_default.png';
	import cursor_fist from '$lib/assets/images/cursor_fist.png';
	import { mouse } from '$lib/scripts/utils.svelte';
	import { fade } from 'svelte/transition';
	import { movingChannels } from '../channels/channels_status.svelte';
</script>

{#if mouse.isVisible}
	<div
		out:fade={{ duration: 150 }}
		class="cursor"
		style:left={mouse.position[0] + 'px'}
		style:top={mouse.position[1] + 'px'}
	>
		<img
			class:fist={movingChannels.isDragging}
			src={movingChannels.isDragging ? cursor_fist : cursor_default}
			alt="cursor"
		/>
	</div>
{/if}

<style lang="scss">
	.cursor {
		filter: drop-shadow(0.4vh 0.4vh 0 rgba(0, 0, 0, 0.25));
		position: absolute;
		pointer-events: none;
		z-index: 10000;

		img {
			--pointer-finger-offset-y: 37%;
			--pointer-finger-offset-x: 13%;

			width: 8vh;
			height: 8vh;
			translate: calc(-1 * var(--pointer-finger-offset-y)) calc(-1 * var(--pointer-finger-offset-x));
			transform-origin: var(--pointer-finger-offset-y) var(--pointer-finger-offset-x);

			&.fist {
				--pointer-finger-offset-y: 50%;
				--pointer-finger-offset-x: 50%;
			}
		}
	}
</style>
