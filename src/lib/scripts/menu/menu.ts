import SOUNDS, { AdvancedSound } from '$lib/assets/sounds/sounds';
import { DraggableEnvironment } from '../draggables.svelte';
import type { RuntimeChannel } from './channels/channel';
import { ChannelManager } from './channels/channelManager';
import { SelectedChannel as ZoomedChannel } from './channels/channelStatus';
import { MenuTraysHandler } from './tray.svelte';

class Menu {
	private channelManager = new ChannelManager();
	private movingChannelEnv = new DraggableEnvironment<RuntimeChannel>('channels');
	private selectedChannel = new ZoomedChannel();
	private traysHandler = new MenuTraysHandler();

	private music = new AdvancedSound({
		sound: SOUNDS.MUSIC.main,
		volume: 0,
		loop: { start: 27.716, end: 34.968 + 1 * 60 }
	});

	public get channels(): ChannelManager {
		return this.channelManager;
	}

	public get channelDraggableEnvironment(): DraggableEnvironment<RuntimeChannel> {
		return this.movingChannelEnv;
	}

	public get zoomedChannel(): ZoomedChannel {
		return this.selectedChannel;
	}

	public get trays(): MenuTraysHandler {
		return this.traysHandler;
	}
}

export const menu = new Menu();
