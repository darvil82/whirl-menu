import type { Component } from 'svelte';
import Test from './Test.svelte';

export interface ChannelDef {
	thumbnail: Component;
	banner: Component;
	name: string;
	position: [number, number];
}

const CHANNELS: ChannelDef[] = [
	{
		name: 'Test channel',
		thumbnail: Test,
		banner: Test,
		position: [0, 0]
	},
	{
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test,
		position: [4, 2]
	},
	{
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test,
		position: [4, 0]
	},
	{
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test,
		position: [5, 1]
	},
	{
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test,
		position: [2, 1]
	},
	{
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test,
		position: [14, 2]
	}
];

export default CHANNELS;
