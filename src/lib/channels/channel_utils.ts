import { unmount, type Component } from 'svelte';
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

export interface RuntimeChannel extends ChannelDef {}

export class Channels {
	private modified = false;
	public defs: RuntimeChannel[];
	private ordered: RuntimeChannel[] | undefined = undefined;

	private static cachedRects: { grid: DOMRect; channel: DOMRect } | undefined;

	public constructor() {
		this.defs = Channels.load();
		this.updateOrdered();
	}

	public update(
		currentChannel: RuntimeChannel,
		updater: (channel: RuntimeChannel) => void
	): boolean {
		const channel = this.defs.find((c) => c.id === currentChannel.id);
		if (!channel) return false;

		this.modified = true;
		updater(channel);
		updater(currentChannel);
		return true;
	}

	public updateAndSave(
		currentChannel: RuntimeChannel,
		updater: (channel: RuntimeChannel) => void
	): boolean {
		if (!this.update(currentChannel, updater)) return false;

		localStorage.setItem(
			'channels',
			JSON.stringify(
				this.defs.map<SimpleChannelDef>((c) => ({
					id: c.id,
					position: c.position
				}))
			)
		);
		console.log('[channels] Updated storage data.');
		return true;
	}

	public getAt([x, y]: [number, number]): ChannelDef | undefined {
		return this.defs.find((c) => c.position[0] == x && c.position[1] == y);
	}

	public getAtAbs(i: number, page: number): RuntimeChannel | undefined {
		return this.getAt(Channels.getPosAbs(i, page));
	}

	public getNext(current: RuntimeChannel, direction: 'left' | 'right'): RuntimeChannel {
		if (!this.ordered) this.updateOrdered();
		const index = this.ordered!.findIndex((c) => c.id === current.id);
		const offset = direction === 'right' ? 1 : -1;
		const newIndex = (index + offset) % this.ordered!.length;

		return this.ordered![newIndex < 0 ? this.ordered!.length - 1 : newIndex];
	}

	static load() {
		const storedChannels = localStorage.getItem('channels');

		if (!storedChannels) {
			console.log('[channels] No storage definition found. Loading defaults.');
			return [...defined_channels];
		}

		console.log('[channels] Loading from storage...');
		const parsedChannels = JSON.parse(storedChannels) as SimpleChannelDef[];
		return parsedChannels.map<RuntimeChannel>((c) => ({
			...Channels.getDefined(c.id)!,
			position: c.position
		}));
	}

	public updateOrdered() {
		if (!this.modified && this.ordered !== undefined) return;
		this.ordered = [];

		for (let page = 0; page < MAX_PAGES; page++) {
			for (let i = 0; i < PAGE_NUM_CHANNELS; i++) {
				const ch = this.getAtAbs(i, page);
				if (ch !== undefined) this.ordered.push(ch);
			}
		}
	}

	public static getDefined(id: string): ChannelDef | undefined {
		return defined_channels.find((c) => c.id == id);
	}

	public static getPage(channelXPos: number) {
		return Math.floor(channelXPos / PAGE_NUM_COLUMNS);
	}

	public static getPosAbs(i: number, page: number): [number, number] {
		return [(i % PAGE_NUM_COLUMNS) + page * PAGE_NUM_COLUMNS, Math.floor(i / PAGE_NUM_COLUMNS)];
	}

	public static getPosLocalGrid(channel: RuntimeChannel): [number, number] {
		return [
			channel?.position[0] % PAGE_NUM_COLUMNS,
			channel?.position[1] % PAGE_NUM_ROWS // shouldnt be needed but
		];
	}

	public static getCSSPos(channel: RuntimeChannel, atCenter: boolean = false): [number, number] {
		const { width: gridWidth, height: gridHeight } = Channels.cachedRects!.grid;

		const [x, y] = Channels.getPosLocalGrid(channel);
		const [incX, incY] = [gridWidth / PAGE_NUM_COLUMNS, gridHeight / PAGE_NUM_ROWS + 5];

		if (atCenter) {
			const [offsetX, offsetY] = [gridWidth / PAGE_NUM_COLUMNS / 2, gridHeight / PAGE_NUM_ROWS / 2];
			return [incX * x + offsetX, incY * y + offsetY];
		}

		return [incX * x, incY * y];
	}

	public static getChanneDOMRect(): DOMRect {
		return Channels.cachedRects!.channel;
	}

	public static refreshDOMRects() {
		Channels.cachedRects = {
			grid: document.querySelector('.channel-grid')!.getBoundingClientRect(),
			channel: document.querySelector('.channel-wrapper')!.getBoundingClientRect()
		};
	}
}

export const channels = new Channels();
