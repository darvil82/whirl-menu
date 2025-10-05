<script lang="typescript">
	import { systemMenuMusic } from '$lib/assets/sounds/sounds';
	import { MAX_PAGES } from '$lib/channels/channel_utils';
	import { mouse } from '$lib/scripts/utils.svelte';
	import { onMount } from 'svelte';
	import { movingChannels, selectedChannel } from '../lib/channels/channels_status.svelte';
	import Cursor from '../lib/components/Cursor.svelte';
	import ScrollArrow from '../lib/components/ScrollArrow.svelte';
	import Banner from './(banner)/Banner.svelte';
	import ChannelPanel from './(channels)/ChannelPanel.svelte';

	let currentPage: number = $state(0);
	let channelPanel: ChannelPanel;
	let showArrows = $state(true);

	$effect(() => {
		if (selectedChannel.isSelected) {
			showArrows = false;
			return;
		}

		setTimeout(() => {
			showArrows = true;
		}, 750);
	});

	onMount(() => {
		document.oncontextmenu = () => false;

		setTimeout(() => {
			systemMenuMusic.start();
		}, 500);

		return () => {
			mouse.detach();
		};
	});
</script>

<Cursor />

<div
	class="menu"
	style:transform-origin={selectedChannel.transformOrigin(true)}
	class:zoom={selectedChannel.isSelected}
>
	<ChannelPanel bind:this={channelPanel} bind:currentPage></ChannelPanel>
</div>
<Banner></Banner>
<ScrollArrow
	position={'left'}
	show={currentPage > 0 && showArrows}
	onclick={() => channelPanel.scrollChannels('left')}
	onKeyDownPredicate={() => !movingChannels.isMoving}>-</ScrollArrow
>
<ScrollArrow
	position={'right'}
	show={currentPage < MAX_PAGES - 1 && showArrows}
	onclick={() => channelPanel.scrollChannels('right')}
	onKeyDownPredicate={() => !movingChannels.isMoving}>+</ScrollArrow
>

<style lang="scss">
	.menu {
		$duration: 0.5s;
		will-change: contents;

		scale: 1;
		transition:
			all $duration cubic-bezier(0.215, 0.61, 0.355, 1),
			transform-origin 0s;

		&.zoom {
			scale: 5;
			translate: -10vw 3vh; // slight offsets to make zoom look better
			transition:
				all #{$duration + 0.05s} cubic-bezier(0.55, 0.055, 0.865, 0.115),
				transform-origin 0s;
		}
	}
</style>
