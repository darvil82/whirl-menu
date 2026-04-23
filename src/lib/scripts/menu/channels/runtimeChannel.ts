import { Menu } from '$lib/scripts/menu/menu';
import { type Component } from 'svelte';

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
	thumbnail: Component<ChannelThumbnailData>;
	banner: Component;
	name: string;
	locked?: boolean;
}

export interface ChannelThumbnailData {
	optimized: boolean;
}

export class RuntimeChannel implements ChannelDef {
	public thumbnail: ChannelDef['thumbnail'];
	public banner: ChannelDef['banner'];
	public name: ChannelDef['name'];
	public id: ChannelDef['id'];
	public position: ChannelDef['position'];
	public locked: ChannelDef['locked'];

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
		const { width: gridWidth, height: gridHeight } =
			Menu.instance().channels.storage.getGridDOMRect();

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
