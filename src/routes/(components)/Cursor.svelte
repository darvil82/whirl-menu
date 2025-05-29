<script lang="typescript">
	import cursor_fist from '$lib/images/cursor_fist.png';
	import cursor_default from '$lib/images/cursor_default.png';
	import { getMousePosition } from '$lib/utils.svelte';
	import { movingChannel } from '../channels/channels_status.svelte';
</script>

{#if getMousePosition()}
	<img
		style:left={getMousePosition()?.[0] + 'px'}
		style:top={getMousePosition()?.[1] + 'px'}
		class:fist={movingChannel.isMoving}
		src={movingChannel.isMoving ? cursor_fist : cursor_default}
		alt=""
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

		&.fist {
			translate: -50% -50%;
		}
	}
</style>
