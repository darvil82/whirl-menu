<script lang="typescript">
	import MenuButton from '$lib/components/MenuButton.svelte';
	import SOUNDS, { getSoundPath, playSound } from '$lib/sounds/sounds';
	import { onMount } from 'svelte';
	import ChannelPanel from './(channels)/ChannelPanel.svelte';
	import { setMousePosition } from '$lib/utils.svelte';
	import Cursor from './(channels)/Cursor.svelte';
	import Banner from './(banner)/Banner.svelte';
	import ScrollArrow from './ScrollArrow.svelte';
	import { Channels, channels, MAX_PAGES } from '$lib/channels/channel_utils';
	import { selectedChannel } from '../lib/channels/channels_status.svelte';

	let musicAudioCtx: AudioContext;
	let musicGainNode: GainNode;

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
		Channels.refreshDOMRects();
		document.oncontextmenu = () => false;
		document.addEventListener('mousemove', (e) => setMousePosition([e.clientX, e.clientY]));

		// musicAudioCtx = new AudioContext();
		// musicGainNode = musicAudioCtx.createGain();
		// musicGainNode.gain.value = 0.25;

		// fetch(getSoundPath(SOUNDS.MUSIC.main))
		// 	.then((response) => response.arrayBuffer())
		// 	.then((data) => musicAudioCtx.decodeAudioData(data))
		// 	.then((buffer) => {
		// 		const source = musicAudioCtx.createBufferSource();
		// 		source.buffer = buffer;
		// 		source.loop = true;
		// 		source.loopStart = 27.716;
		// 		source.loopEnd = 34.968 + 1 * 60;
		// 		source.connect(musicGainNode).connect(musicAudioCtx.destination);
		// 		source.start(0);
		// 	});

		// return () => musicAudioCtx.close();
	});
</script>

<Cursor></Cursor>

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
	onclick={() => channelPanel.scrollChannels('left')}>-</ScrollArrow
>
<ScrollArrow
	position={'right'}
	show={currentPage < MAX_PAGES - 1 && showArrows}
	onclick={() => channelPanel.scrollChannels('right')}>+</ScrollArrow
>

<style lang="scss">
	.menu {
		will-change: contents;
		scale: 1;
		transition:
			all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1),
			transform-origin 0s;

		&.zoom {
			scale: 5;
			translate: -10vw 3vh; // slight offsets to make zoom look better
			transition:
				all 0.55s cubic-bezier(0.55, 0.055, 0.865, 0.115),
				transform-origin 0s;
		}
	}
</style>
