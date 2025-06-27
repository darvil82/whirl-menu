<script lang="typescript">
	import cursor_fist from '$lib/assets/images/cursor_fist.png';
	import cursor_default from '$lib/assets/images/cursor_default.png';
	import { movingChannel } from '../../lib/channels/channels_status.svelte';
	import { fade } from 'svelte/transition';
	import { mouse } from '$lib/utils.svelte';
</script>

{#if mouse.isVisible}
	<img
		out:fade={{ duration: 150 }}
		style:left={mouse.position[0] + 'px'}
		style:top={mouse.position[1] + 'px'}
		class:fist={movingChannel.isMoving}
		src={movingChannel.isMoving ? cursor_fist : cursor_default}
		alt="cursor"
	/>
{/if}

<style lang="scss">
	img {
		position: absolute;
		pointer-events: none;
		z-index: 10000;
		width: 8vh;
		height: 8vh;
		translate: -35% -5%;
		filter: drop-shadow(0.4vh 0.4vh 0 rgba(0, 0, 0, 0.25));

		&.fist {
			translate: -50% -50%;
		}
	}
</style>
