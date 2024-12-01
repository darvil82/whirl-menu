import type { Component, SvelteComponent } from 'svelte';
import Test from './Test.svelte';
import DefaultThumbnail from './default_thumbnail/DefaultThumbnail.svelte';

export interface Channel {
	thumbnail: Component;
	banner: Component;
}

const CHANNELS: Channel[] = [
	{
		thumbnail: Test,
		banner: Test
	}
];

export default CHANNELS;
