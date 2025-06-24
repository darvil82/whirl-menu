import type { Component } from 'svelte';
import Test from '$lib/channels_def/Test.svelte';
import Test2 from './Test2.svelte';

export const MAX_PAGES = 4;
export const PAGE_SCROLL_DELAY = 500;
export const PAGE_NUM_ROWS = 3;
export const PAGE_NUM_COLUMNS = 4;
export const PAGE_NUM_CHANNELS = PAGE_NUM_COLUMNS * PAGE_NUM_ROWS;

export interface SimpleChannelDef {
	id: string;
	position: [number, number];
}

export interface ChannelDef extends SimpleChannelDef {
	thumbnail: Component;
	banner: Component;
	name: string;
}

const ORIGINAL_CHANNELS: ChannelDef[] = [
	{
		id: 'test1',
		name: 'Test channel',
		thumbnail: Test,
		banner: Test2,
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

export let channels: ChannelDef[] = loadChannels();

export function updateChannel(id: string, updater: (channel: ChannelDef) => void): boolean {
	const channel = channels.find((c) => c.id === id);
	if (!channel) return false;

	updater(channel);
	localStorage.setItem(
		'channels',
		JSON.stringify(
			channels.map<SimpleChannelDef>((c) => ({
				id: c.id,
				position: c.position
			}))
		)
	);
	console.log('[channels] Updated storage data.');
	return true;
}

export function getOriginalChannel(id: string): ChannelDef | undefined {
	return ORIGINAL_CHANNELS.find((c) => c.id == id);
}

export function getChannelAt([x, y]: [number, number]): ChannelDef | undefined {
	return channels.find((c) => c.position[0] == x && c.position[1] == y);
}

export function loadChannels() {
	const storedChannels = localStorage.getItem('channels');

	if (!storedChannels) {
		console.log('[channels] No storage definition found. Loading defaults.');
		return [...ORIGINAL_CHANNELS];
	}

	console.log('[channels] Loading from storage...');
	const parsedChannels = JSON.parse(storedChannels) as SimpleChannelDef[];
	return parsedChannels.map<ChannelDef>((c) => ({
		...getOriginalChannel(c.id)!,
		position: c.position
	}));
}

export default ORIGINAL_CHANNELS;
