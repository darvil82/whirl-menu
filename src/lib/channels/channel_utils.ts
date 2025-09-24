import { makeNamespace } from '$lib/utils.svelte';
import { type Component } from 'svelte';
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
	locked?: boolean;
}

export class RuntimeChannel implements ChannelDef {
	public thumbnail: Component;
	public banner: Component;
	public name: string;
	public id: string;
	public position: [number, number];
	public locked: boolean;

	constructor(def: ChannelDef) {
		this.thumbnail = def.thumbnail;
		this.banner = def.banner;
		this.name = def.name;
		this.id = def.id;
		this.position = def.position;
		this.locked = def.locked ?? false;
	}

	public getPage() {
		return Math.floor(this.position[0] / PAGE_NUM_COLUMNS);
	}

	public getPosLocalGrid(): [number, number] {
		return [
			this.position[0] % PAGE_NUM_COLUMNS,
			this.position[1] % PAGE_NUM_ROWS // shouldnt be needed but
		];
	}

	public getCSSPos(atCenter: boolean = false): [number, number] {
		const { width: gridWidth, height: gridHeight } = Channels.getGridDOMRect();

		const [x, y] = this.getPosLocalGrid();
		const [incX, incY] = [gridWidth / PAGE_NUM_COLUMNS, gridHeight / PAGE_NUM_ROWS + 5];

		if (atCenter) {
			const [offsetX, offsetY] = [gridWidth / PAGE_NUM_COLUMNS / 2, gridHeight / PAGE_NUM_ROWS / 2];
			return [incX * x + offsetX, incY * y + offsetY];
		}

		return [incX * x, incY * y];
	}

	public static getPosAbs(i: number, page: number): [number, number] {
		return [(i % PAGE_NUM_COLUMNS) + page * PAGE_NUM_COLUMNS, Math.floor(i / PAGE_NUM_COLUMNS)];
	}
}

export class Channels {
	private modified = false;
	private defs: RuntimeChannel[];
	private ordered: RuntimeChannel[] | undefined = undefined;
	private static ns = makeNamespace('channels');

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
		Channels.ns.log('Updated storage data.');
		return true;
	}

	public getAt([x, y]: [number, number]): RuntimeChannel | undefined {
		return this.defs.find((c) => c.position[0] == x && c.position[1] == y);
	}

	public getAtAbs(i: number, page: number): RuntimeChannel | undefined {
		return this.getAt(RuntimeChannel.getPosAbs(i, page));
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
			Channels.ns.log('No storage definition found. Loading defaults.');
			return [...defined_channels].map((c) => new RuntimeChannel(c));
		}

		Channels.ns.log('Loading from storage...');
		const parsedChannels = JSON.parse(storedChannels) as SimpleChannelDef[];
		return parsedChannels.map<RuntimeChannel>(
			(c) =>
				new RuntimeChannel({
					...Channels.getDefined(c.id)!,
					position: c.position
				})
		);
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

	public static getChanneDOMRect(): DOMRect {
		return Channels.cachedRects!.channel;
	}

	public static getGridDOMRect(): DOMRect {
		return Channels.cachedRects!.grid;
	}

	public static refreshDOMRects() {
		Channels.ns.log('Refreshing cached DOM rects...');
		Channels.cachedRects = {
			grid: document.querySelector('.channel-grid')!.getBoundingClientRect(),
			channel: document.querySelector('.channel-wrapper')!.getBoundingClientRect()
		};
	}
}

export const channels = new Channels();
