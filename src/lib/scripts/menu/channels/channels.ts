import { DraggableEnvironment } from '$lib/scripts/draggables.svelte';
import { ZoomedChannel } from './channelStatus.svelte';
import { ChannelStorage } from './channelStorage';
import type { RuntimeChannel } from './runtimeChannel';

export class ChannelManager {
	private channelStorage = new ChannelStorage();
	private movingChannelEnv = new DraggableEnvironment<RuntimeChannel>('channels');
	private zoomedChannel = new ZoomedChannel();

	public get storage(): ChannelStorage {
		return this.channelStorage;
	}

	public get draggableEnvironment(): DraggableEnvironment<RuntimeChannel> {
		return this.movingChannelEnv;
	}

	public get zoomed(): ZoomedChannel {
		return this.zoomedChannel;
	}
}
