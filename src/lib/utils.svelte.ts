import type { Attachment } from 'svelte/attachments';
import SOUNDS, { SimpleSound } from './assets/sounds/sounds';

export type Direction1D = 'left' | 'right';
export type AnchorPosition = Direction1D | 'center';

export function ellipsize(str: string, maxSize: number): string {
	if (str.length <= maxSize) return str;

	return str.substring(0, maxSize - 3) + '...';
}

export interface Draggable {
	element: HTMLElement;
	onClick?: (e: MouseEvent) => void;
	onDrag?: (e: MouseEvent) => boolean;
	onStopDrag?: (e: MouseEvent) => void;
}

export interface DropZone {
	element: HTMLElement;
	onDrop?: (e: MouseEvent, draggable: Draggable) => boolean;
}

class DragEnvironment {
	private ns = makeNamespace('DragEnvironment', () => this.name);
	private draggables: Draggable[] = $state([]);
	private dropZones: DropZone[] = $state([]);
	public onOnDropOutside: ((e: MouseEvent, draggable: Draggable) => void) | undefined = $state();

	public constructor(private name: string) {}

	public registerDraggable(draggable: Draggable) {
		this.draggables.push(draggable);
		draggable.element.dataset.draggable = 'true';
	}

	public unregisterDraggable(element: HTMLElement) {
		this.draggables = this.draggables.filter((d) => d.element !== element);
		delete element.dataset.draggable;
	}

	public registerDropZone(dropZone: DropZone) {
		this.dropZones.push(dropZone);
	}

	public unregisterDropZone(element: HTMLElement) {
		this.dropZones = this.dropZones.filter((d) => d.element !== element);
	}

	public testDraggable(e: MouseEvent): Draggable | undefined {
		const draggable = this.draggables.find((d) => d.element === e.target);
		if (!draggable) return;

		if (e.buttons == 3) {
			if (!draggable.onDrag?.(e)) return;
			return draggable;
		} else if (e.buttons == 1) {
			draggable.onClick?.(e);
		}
	}

	public testDropZone(e: MouseEvent, m: Mouse): boolean {
		if (!this.targetIsDraggable(m.draggingData?.element)) return false;
		const dropZone = this.dropZones.find((d) => e.target === d.element);

		if (!dropZone) {
			this.ns.log('Dropped outside any drop zone. Falling back to outside handler');
			this.onOnDropOutside?.(e, m.draggingData!);
			return true;
		}

		if (!dropZone.onDrop?.(e, m.draggingData!)) {
			// drop was not accepted
			this.ns.log('Drop zone did not accept the drop. Falling back to outside handler');
			this.onOnDropOutside?.(e, m.draggingData!);
			return true;
		}

		this.ns.log('Dropped on a drop zone');
		return true;
	}

	public targetIsDraggable(element: HTMLElement | undefined) {
		return this.draggables.find((d) => d.element === element) !== undefined;
	}
}

class Mouse {
	private pos: [number, number] | undefined = $state();
	private inView = $state(true);
	private dragEnvs: DragEnvironment[] = $state([]);
	private _draggingData: Draggable | undefined = $state();

	private static ns = makeNamespace('mouse');

	public constructor() {
		document.addEventListener('mousemove', this.onMove);
		document.addEventListener('mouseleave', this.onHide);
		document.addEventListener('mouseenter', this.onShow);
		document.addEventListener('mousedown', this.onMouseDown);
		document.addEventListener('mouseup', this.onMouseUp);
	}

	public detach() {
		document.removeEventListener('mousemove', this.onMove);
		document.removeEventListener('mouseleave', this.onHide);
		document.removeEventListener('mouseenter', this.onShow);
		document.removeEventListener('mousedown', this.onMouseDown);
		document.removeEventListener('mouseup', this.onMouseUp);
	}

	private onHide = () => {
		this.inView = false;
	};

	private onShow = () => {
		this.inView = true;
	};

	private onMouseDown = debounce((e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (this._draggingData !== undefined || target.dataset.draggable !== 'true') return;

		for (const env of this.dragEnvs) {
			const draggable = env.testDraggable(e);
			if (!draggable) continue;

			this._draggingData = draggable;
			break;
		}
	}, 50);

	private onMouseUp = (e: MouseEvent) => {
		if (this._draggingData === undefined) return;

		for (const env of this.dragEnvs) {
			const dropZone = env.testDropZone(e, this);
			if (!dropZone) continue;

			break;
		}

		Mouse.ns.log('Stopped dragging');
		this._draggingData?.onStopDrag?.(e);
		this._draggingData = undefined;
	};

	private onMove = (e: MouseEvent) => {
		this.pos = [e.x, e.y];
	};

	public registerDragEnvironment(env: DragEnvironment) {
		this.dragEnvs.push(env);
	}

	public unregisterDragEnvironment(env: DragEnvironment) {
		this.dragEnvs = this.dragEnvs.filter((d) => d !== env);
	}

	get position() {
		return this.pos ?? [0, 0];
	}

	get visible() {
		return this.pos !== undefined && this.inView;
	}

	get dragging() {
		return this._draggingData !== undefined;
	}

	get draggingData() {
		return this._draggingData;
	}
}

export const mouse = new Mouse();
export const channelDragEnv = new DragEnvironment('channels');
mouse.registerDragEnvironment(channelDragEnv);

export function debounce<P extends any[]>(
	func: (...args: P) => void,
	delay: number
): (...args: P) => void {
	let timer: number;

	return (...args: P) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func(...args);
		}, delay);
	};
}

export function throttle<P extends any[]>(
	func: (...args: P) => void,
	limit: number
): (...args: P) => void {
	let inThrottle: boolean;

	return (...args: P) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
}

export function balloon(
	label: string,
	show: boolean,
	options: {
		anchor?: AnchorPosition;
		offset?: [number, number];
	}
): Attachment<HTMLElement> {
	return (element) => {
		if (!show) return;

		const bubble = document.createElement('div');
		let hoverTimeout: number;
		bubble.classList.add('bubble', options.anchor ?? 'center');

		if (options.offset) {
			bubble.style.setProperty('--offset-x', options.offset[0].toString());
			bubble.style.setProperty('--offset-x', options.offset[0].toString());
		}

		bubble.textContent = ellipsize(label, 30);

		function mouseover(e: MouseEvent) {
			hoverTimeout = setTimeout(() => {
				bubble.classList.add('visible');
				SimpleSound.play(SOUNDS.MISC.balloon);
			}, 350);
		}

		function mouseleave(e: MouseEvent) {
			bubble.classList.remove('visible');
			clearTimeout(hoverTimeout);
		}

		element.addEventListener('mouseover', mouseover);
		element.addEventListener('mouseleave', mouseleave);
		element.appendChild(bubble);

		return () => {
			element.removeEventListener('mouseover', mouseover);
			element.removeEventListener('mouseleave', mouseleave);
			bubble.remove();
		};
	};
}

function getHeading(namespace: string, extra?: () => string) {
	return '[' + (extra ? `${namespace} (${extra()})` : namespace) + ']:';
}

export function makeNamespace(namespace: string, extra?: () => string) {
	return {
		log: (...params: any[]) => console.log(getHeading(namespace, extra), ...params),
		warn: (...params: any[]) => console.warn(getHeading(namespace, extra), ...params),
		error: (...params: any[]) => console.error(getHeading(namespace, extra), ...params),
		throw: (msg: string) => {
			throw new Error(`${getHeading(namespace, extra)} ${msg}`);
		}
	};
}
