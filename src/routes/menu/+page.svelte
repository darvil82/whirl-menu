<script lang="typescript">
	import Cursor from '$lib/components/Cursor.svelte';
	import ScrollArrow from '$lib/components/ScrollArrow.svelte';
	import { MAX_PAGES } from '$lib/scripts/menu/channels/runtimeChannel';
	import { Menu } from '$lib/scripts/menu/menu';
	import { mouse } from '$lib/scripts/mouse.svelte';
	import { onMount } from 'svelte';
	import Banner from './(banner)/Banner.svelte';
	import ButtonTray from './(bottom)/ButtonTray.svelte';
	import Date from './(bottom)/Date.svelte';
	import ChannelPanel from './(channels)/(channelPanel)/ChannelPanel.svelte';

	let currentPage: number = $state(0);
	let channelPanel: ChannelPanel;
	let showArrows = $state(true);

	$effect(() => {
		if (Menu.instance().channels.zoomed.isSelected) {
			showArrows = false;
			return;
		}

		setTimeout(() => {
			showArrows = true;
		}, 500);
	});

	onMount(() => {
		document.oncontextmenu = () => false;

		setTimeout(() => {
			Menu.instance().music.play();
		}, 500);

		return () => {
			mouse.detach();
		};
	});
</script>

<Cursor />

<div
	class="menu"
	style:transform-origin={Menu.instance().channels.zoomed.transformOrigin(true)}
	class:zoom={Menu.instance().channels.zoomed.isSelected}
>
	<ChannelPanel bind:this={channelPanel} bind:currentPage></ChannelPanel>
	<div class="bottom-menu">
		<ButtonTray position="left"></ButtonTray>
		<Date></Date>
		<ButtonTray position="right"></ButtonTray>
	</div>
</div>
<Banner></Banner>
<ScrollArrow
	position={'left'}
	show={currentPage > 0 && showArrows}
	onclick={() => channelPanel.scrollChannels('left')}
	onKeyDownPredicate={() => !Menu.instance().channels.draggableEnvironment.isDragging}
/>
<ScrollArrow
	position={'right'}
	show={currentPage < MAX_PAGES - 1 && showArrows}
	onclick={() => channelPanel.scrollChannels('right')}
	onKeyDownPredicate={() => !Menu.instance().channels.draggableEnvironment.isDragging}
/>

<style lang="scss">
	.menu {
		display: flex;
		flex-direction: column;
		$duration-in: 0.4s;
		$duration-out: 0.6s;
		will-change: contents;
		height: 100%;

		scale: 1;
		transition:
			all $duration-out cubic-bezier(0.215, 0.61, 0.355, 1),
			transform-origin 0s;

		&.zoom {
			scale: 5;
			translate: -10vw 3vh; // slight offsets to make zoom look better
			transition:
				all #{$duration-in + 0.07s} cubic-bezier(0.55, 0.055, 0.865, 0.115),
				transform-origin 0s;
		}
	}

	.bottom-menu {
		position: relative;
		display: flex;
		margin-top: auto;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 5vh;
		z-index: -1;
	}
</style>
