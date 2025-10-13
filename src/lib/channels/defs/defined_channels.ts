import type { ChannelDef } from '../channels';
import DiscChannelThumbnail from './disc_channel/DiscChannelThumbnail.svelte';
import Test from './Test.svelte';
import Test2 from './Test2.svelte';

export default [
	{
		id: 'disc',
		name: 'Disc Channel',
		thumbnail: DiscChannelThumbnail,
		banner: Test2,
		position: [0, 0],
		locked: true
	},
	{
		id: 'test1',
		name: 'Test channel',
		thumbnail: Test,
		banner: Test2,
		position: [1, 0]
	},
	{
		id: 'test2',
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test2,
		position: [4, 2]
	},
	{
		id: 'test3',
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test2,
		position: [4, 0]
	},
	{
		id: 'test4',
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test2,
		position: [5, 1]
	},
	{
		id: 'test5',
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test2,
		position: [2, 1]
	},
	{
		id: 'test6',
		name: 'A little longer name',
		thumbnail: Test,
		banner: Test2,
		position: [14, 2]
	}
] satisfies ChannelDef[];
