<script lang="typescript">
	import {
		channels,
		PAGE_NUM_CHANNELS,
		PAGE_NUM_COLUMNS,
		RuntimeChannel
	} from '../../lib/channels/channel_utils';
	import Channel from './Channel.svelte';

	const {
		page,
		hide
	}: {
		page: number;
		hide?: 'all' | 'left' | 'right';
	} = $props();

	function getChannelPosition(i: number): 'left' | 'right' | 'center' {
		if (i % PAGE_NUM_COLUMNS == 0) return 'left';
		if (i % PAGE_NUM_COLUMNS == 3) return 'right';
		return 'center';
	}

	function getChannelVisibility(i: number): boolean {
		if (hide == 'left') return i % PAGE_NUM_COLUMNS == 3;
		if (hide == 'right') return i % PAGE_NUM_COLUMNS == 0;
		if (hide == 'all') return false;
		return true;
	}
</script>

<div class="channel-grid" class:hide>
	{#each new Array(PAGE_NUM_CHANNELS) as _, i}
		<Channel
			position={RuntimeChannel.getPosAbs(i, page)}
			channel={channels.getAtAbs(i, page)}
			bubblePosition={getChannelPosition(i)}
			hide={!getChannelVisibility(i)}
		></Channel>
	{/each}
</div>

<style lang="scss">
	.channel-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(3, 1fr);
		gap: 1rem;
		height: 61vh;
		width: 100%;
		padding-inline: 0.5rem;
		z-index: 1;
		flex-shrink: 0;
		translate: var(--grid-translate);
		transition: translate 0.5s;

		&.hide {
			pointer-events: none;
		}
	}
</style>
