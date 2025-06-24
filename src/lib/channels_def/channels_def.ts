import type { Component } from 'svelte';
import Test from '$lib/channels_def/Test.svelte';

export const MAX_PAGES = 4;
export const PAGE_SCROLL_DELAY = 500;
export const PAGE_NUM_ROWS = 3;
export const PAGE_NUM_COLUMNS = 4;
export const PAGE_NUM_CHANNELS = PAGE_NUM_COLUMNS * PAGE_NUM_ROWS;

export interface ChannelDef {
	id: string;
	thumbnail: Component;
	banner: Component;
	name: string;
	position: [number, number];
}

const CHANNELS: ChannelDef[] = [
	{
		id: 'test1',
		name: 'Test channel',
		thumbnail: Test,
		banner: Test,
		position: [0, 0]
	},
	{
		id: 'test2',
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test,
		position: [4, 2]
	},
	{
		id: 'test3',
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test,
		position: [4, 0]
	},
	{
		id: 'test4',
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test,
		position: [5, 1]
	},
	{
		id: 'test5',
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test,
		position: [2, 1]
	},
	{
		id: 'test6',
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test,
		position: [14, 2]
	}
];

export let channels = CHANNELS.map((c) => ({ ...c }));

export default CHANNELS;
