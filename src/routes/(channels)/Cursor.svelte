<script lang="typescript">
	import cursor_fist from '$lib/images/cursor_fist.png';
	import cursor_default from '$lib/images/cursor_default.png';
	import { getMousePosition } from '$lib/utils.svelte';
	import { movingChannel } from '../../lib/channels/channels_status.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let _show = $state(true);

	function show() {
		_show = true;
	}

	function hide() {
		_show = false;
	}

	onMount(() => {
		document.addEventListener('mouseleave', hide);
		document.addEventListener('mouseenter', show);

		return () => {
			document.removeEventListener('mouseleave', hide);
			document.addEventListener('mouseenter', show);
		};
	});
</script>

{#if getMousePosition() && _show}
	<img
		out:fade={{ duration: 150 }}
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
		filter: drop-shadow(0.4vh 0.4vh 0 rgba(0, 0, 0, 0.25));

		&.fist {
			translate: -50% -50%;
		}
	}
</style>
