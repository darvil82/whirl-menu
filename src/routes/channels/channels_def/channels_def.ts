import type { Component } from 'svelte';
import Test from './Test.svelte';

export interface Channel {
	thumbnail: Component;
	banner: Component;
	name: string;
}

const CHANNELS: Channel[] = [
	{
		name: 'Test channel',
		thumbnail: Test,
		banner: Test
	},
	{
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test
	},
	{
		name: 'Bla bla bla',
		thumbnail: Test,
		banner: Test
	},
	{
		name: 'Okay now this one is getting a bit ridiculous',
		thumbnail: Test,
		banner: Test
	}
];

export default CHANNELS;
