import SOUNDS from '$lib/assets/sounds/soundsDefinition';
import { AdvancedSound } from '../sound';
import { ChannelManager } from './channels/channels';
import { MenuTraysHandler } from './tray.svelte';

export class Menu {
	private traysHandler = new MenuTraysHandler();
	private channelManager = new ChannelManager();
	private bgMusic = new AdvancedSound({
		sound: SOUNDS.MUSIC.main,
		volume: 0,
		loop: { start: 27.716, end: 34.968 + 1 * 60 }
	});

	public get trays(): MenuTraysHandler {
		return this.traysHandler;
	}

	public get channels(): ChannelManager {
		return this.channelManager;
	}

	public get music(): AdvancedSound {
		return this.bgMusic;
	}

	private static singleton: Menu;

	public static instance() {
		return Menu.singleton;
	}

	public static _initialize() {
		Menu.singleton = new Menu();
	}
}
