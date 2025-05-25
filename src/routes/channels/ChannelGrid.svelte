<script lang="typescript">
	import Channel from './Channel.svelte';
	import type { ChannelDef } from './channels_def/channels_def';
	import CHANNELS from './channels_def/channels_def';

	const NUM_ROWS = 3;
	const NUM_COLUMNS = 4;
	const NUM_ELEMENTS = NUM_COLUMNS * NUM_ROWS;

	const {
		page,
		hide
	}: {
		page: number;
		hide?: 'all' | 'left' | 'right';
	} = $props();

	function getChannelPosition(i: number): 'left' | 'right' | 'center' {
		if (i % NUM_COLUMNS == 0) return 'left';
		if (i % NUM_COLUMNS == 3) return 'right';
		return 'center';
	}

	function getChannelVisibility(i: number): boolean {
		if (hide == 'left') return i % NUM_COLUMNS == 3;
		if (hide == 'right') return i % NUM_COLUMNS == 0;
		if (hide == 'all') return false;
		return true;
	}

	function getAbsPos(i: number): [number, number] {
		return [(i % NUM_COLUMNS) + page * NUM_COLUMNS, Math.floor(i / NUM_COLUMNS)];
	}

	function getChannelDef(i: number): ChannelDef | undefined {
		const [absX, absY] = getAbsPos(i);

		return CHANNELS.find((c) => c.position[0] == absX && c.position[1] == absY);
	}
</script>

<div class="channel-grid" class:hide>
	{#each new Array(NUM_ELEMENTS) as _, i}
		<Channel
			position={getAbsPos(i)}
			channel={getChannelDef(i)}
			titlePosition={getChannelPosition(i)}
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
