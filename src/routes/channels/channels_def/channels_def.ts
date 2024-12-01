import type { Component, SvelteComponent } from 'svelte';
import Test from './Test.svelte';
import DefaultThumbnail from './default_thumbnail/DefaultThumbnail.svelte';

export interface Channel {
	thumbnail: Component;
	banner: Component;
	name: string;
}

const CHANNELS: Channel[] = [
	{
		name: 'Test',
		thumbnail: Test,
		banner: Test
	}
];

export default CHANNELS;
