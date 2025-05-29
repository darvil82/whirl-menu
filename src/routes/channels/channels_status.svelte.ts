import type { ChannelDef } from './channels_def';

export let movingChannel: {
	channel?: ChannelDef;
	gridPosition?: [number, number];
	screenPosition?: [number, number];
} = $state({});
