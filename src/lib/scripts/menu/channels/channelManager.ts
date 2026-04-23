import defined_channels from '$lib/custom/channels/defs/channelsDefinition';
import { makeNamespace } from '$lib/scripts/utils.svelte';
import {
	MAX_PAGES,
	PAGE_NUM_CHANNELS,
	RuntimeChannel,
	type ChannelDef,
	type SimpleChannelDef
} from './channel';

export class ChannelManager {
	private modified = false;
	private defs: RuntimeChannel[];
	private ordered: RuntimeChannel[] | undefined = undefined;
	private static ns = makeNamespace('channels');

	private static cachedRects: { grid: DOMRect; channel: DOMRect } | undefined;

	public constructor() {
		this.defs = ChannelManager.load();
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
		ChannelManager.ns.log('Updated storage data.');
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
			ChannelManager.ns.log('No storage definition found. Loading defaults.');
			return [...defined_channels].map((c) => new RuntimeChannel(c));
		}

		ChannelManager.ns.log('Loading from storage...');
		const parsedChannels = JSON.parse(storedChannels) as SimpleChannelDef[];
		debugger;
		return parsedChannels.map<RuntimeChannel>(
			(c) =>
				new RuntimeChannel({
					...ChannelManager.getDefined(c.id)!,
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
		return ChannelManager.cachedRects!.channel;
	}

	public static getGridDOMRect(): DOMRect {
		return ChannelManager.cachedRects!.grid;
	}

	public static refreshDOMRects() {
		ChannelManager.ns.log('Refreshing cached DOM rects...');
		ChannelManager.cachedRects = {
			grid: document.querySelector('.channel-grid')!.getBoundingClientRect(),
			channel: document.querySelector('.channel-wrapper')!.getBoundingClientRect()
		};
	}
}
