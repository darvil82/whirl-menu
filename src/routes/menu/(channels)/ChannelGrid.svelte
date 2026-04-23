<script lang="typescript">
	import {
		PAGE_NUM_CHANNELS,
		PAGE_NUM_COLUMNS,
		RuntimeChannel
	} from '$lib/scripts/menu/channels/runtimeChannel';
	import { menu } from '$lib/scripts/menu/menu';
	import Channel from './Channel.svelte';

	const {
		page,
		hide,
		...extraOptions
	}: {
		page: number;
		hide?: 'all' | 'left' | 'right';
		scrolling: boolean;
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
		{#if getChannelVisibility(i)}
			<Channel
				position={RuntimeChannel.getPosAbs(i, page)}
				channel={menu.channels.storage.getAtAbs(i, page)}
				bubblePosition={getChannelPosition(i)}
				{...extraOptions}
			/>
		{:else}
			<div></div>
		{/if}
	{/each}
</div>

<style lang="scss">
	.channel-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(3, 1fr);
		gap: 1rem;
		height: 65vh;
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
