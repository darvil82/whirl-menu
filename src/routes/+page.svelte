<script lang="typescript">
	import MenuButton from '$lib/components/MenuButton.svelte';
	import SOUNDS, { getSoundPath, playSound } from '$lib/sounds/sounds';
	import { onMount } from 'svelte';
	import ChannelPanel from './channels/ChannelPanel.svelte';

	let musicAudioCtx: AudioContext;
	let musicGainNode: GainNode;

	onMount(() => {
		document.oncontextmenu = () => false;

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

<div class="menu">
	<ChannelPanel></ChannelPanel>
</div>
