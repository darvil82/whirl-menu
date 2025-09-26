import { debounce, makeNamespace } from './utils.svelte';

class DragContext<T> {
	private _isAccepted: boolean = false;
	private _extraData: T | undefined;

	public constructor(private _event: MouseEvent) {}

	public accept(data?: T) {
		this._isAccepted = true;
		this._extraData = data;
	}

	public get accepted() {
		return this._isAccepted;
	}

	public get extraData() {
		return this._extraData;
	}

	public get event() {
		return this._event;
	}
}

interface Dragger<T> {
	element: HTMLElement;
	onClick: (e: MouseEvent) => void;
	onDrag: (ctx: DragContext<T>) => void;
}

class DraggableEnvironment<T> {
	private onMouseDownDebounced = debounce(this.onMouseDown, 50);
	private draggers: Dragger<T>[] = [];
	private dragging: Dragger<T> | undefined;

	private ns = makeNamespace('draggable_environment', () => this.name);

	public constructor(private name: string) {
		document.addEventListener('mousedown', this.onMouseDownDebounced);
		document.addEventListener('mouseup', this.onMouseUp);
	}

	public detach() {
		document.removeEventListener('mousedown', this.onMouseDownDebounced);
		document.removeEventListener('mouseup', this.onMouseUp);
	}

	public registerDragger(dragger: Dragger<T>) {
		this.draggers.push(dragger);
	}

	public unregisterDragger(element: HTMLElement) {
		const dragger = this.getDraggerWithElement(element);
		if (!dragger)
			throw this.ns.throwable('could not find dragger with given element to unregister');
		this.draggers.splice(this.draggers.indexOf(dragger));
	}

	private onMouseDown(e: MouseEvent) {
		if (this.dragging) return;

		const element = e.target as HTMLElement;
		const dragger = this.getDraggerWithElement(element);
		if (!dragger) return;

		if (e.buttons == 3) {
			const ctx = new DragContext<T>(e);
			dragger.onDrag(ctx);

			if (!ctx.accepted) {
				this.ns.error('draggable denied drag');
				return;
			}

			this.dragging = dragger;
		} else if (e.buttons == 1) {
			dragger.onClick(e);
		}
	}

	private onMouseUp(e: MouseEvent) {}

	private getDraggerWithElement(element: HTMLElement): Dragger<T> | undefined {
		return this.draggers.find((d) => d.element === element);
	}
}
