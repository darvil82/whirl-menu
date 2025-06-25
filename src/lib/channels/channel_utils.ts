import type { Component } from 'svelte';
import Test from './defs/Test.svelte';
import Test2 from './defs/Test2.svelte';
import defined_channels from './defs/defined_channels';

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

export interface RuntimeChannel extends ChannelDef {
	element?: HTMLButtonElement;
}

export let channels: RuntimeChannel[] = loadChannels();
export let orderedChannels: RuntimeChannel[] = [];

export function updateChannel(
	currentChannel: RuntimeChannel,
	updater: (channel: RuntimeChannel) => void
): boolean {
	const channel = channels.find((c) => c.id === currentChannel.id);
	if (!channel) return false;

	updater(channel);
	updater(currentChannel);
	return true;
}

export function updateAndSaveChannel(
	currentChannel: RuntimeChannel,
	updater: (channel: RuntimeChannel) => void
): boolean {
	if (!updateChannel(currentChannel, updater)) return false;

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
	return defined_channels.find((c) => c.id == id);
}

export function getChannelAt([x, y]: [number, number]): ChannelDef | undefined {
	return channels.find((c) => c.position[0] == x && c.position[1] == y);
}

export function getChannelPage(channelXPos: number) {
	return channelXPos / PAGE_NUM_COLUMNS;
}

export function getChannelPosAbs(i: number, page: number): [number, number] {
	return [(i % PAGE_NUM_COLUMNS) + page * PAGE_NUM_COLUMNS, Math.floor(i / PAGE_NUM_COLUMNS)];
}

export function getChannelDefAbs(i: number, page: number): RuntimeChannel | undefined {
	return getChannelAt(getChannelPosAbs(i, page));
}

export function loadChannels() {
	const storedChannels = localStorage.getItem('channels');

	if (!storedChannels) {
		console.log('[channels] No storage definition found. Loading defaults.');
		return [...defined_channels];
	}

	console.log('[channels] Loading from storage...');
	const parsedChannels = JSON.parse(storedChannels) as SimpleChannelDef[];
	return parsedChannels.map<RuntimeChannel>((c) => ({
		...getOriginalChannel(c.id)!,
		position: c.position
	}));
}

export function updateOrderedChannels() {}
