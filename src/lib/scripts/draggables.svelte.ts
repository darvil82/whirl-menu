import { debounce, makeNamespace } from './utils.svelte';

export class DragContext<T> {
	private _isAccepted: boolean = false;
	private _extraData: T | undefined;

	public constructor(
		private _event: MouseEvent,
		private _dragger: Dragger<T>
	) {}

	public accept(data?: T) {
		this._isAccepted = true;
		this._extraData = data;
	}

	public deny() {
		this._isAccepted = false;
	}

	public get accepted() {
		return this._isAccepted;
	}

	public get extraData() {
		return this._extraData;
	}

	public get dragger() {
		return this._dragger;
	}

	public get event() {
		return this._event;
	}

	public forwardData(newCtx: DragContext<T>) {
		newCtx._extraData = this._extraData;
	}
}

interface Dragger<T> {
	element: HTMLElement;
	onClick: (e: MouseEvent) => void;
	onDrag: (ctx: DragContext<T>) => void;
	onDropOutside?: (ctx: DragContext<T>) => void;
}

interface Droppable<T> {
	element: HTMLElement;
	onDrop: (ctx: DragContext<T>) => void;
}

export class DraggableEnvironment<T> {
	private onMouseDownDebounced = debounce((e: MouseEvent) => this.onMouseDown(e), 50);
	private draggers: Dragger<T>[] = [];
	private droppables: Droppable<T>[] = [];
	private dragging: DragContext<T> | undefined = $state();
	private defaultOnDropOutside: ((ctx: DragContext<T>) => void) | undefined;

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
		this.ns.log('registered', dragger);
	}

	public unregisterDragger(element: HTMLElement) {
		const dragger = this.getDraggerWithElement(element);
		if (!dragger)
			throw this.ns.throwable('could not find dragger with given element to unregister');
		this.draggers.splice(this.draggers.indexOf(dragger));
		this.ns.log('unregistered', dragger);
	}

	public registerDroppable(droppable: Droppable<T>) {
		this.droppables.push(droppable);
	}

	public unregisterDroppable(element: HTMLElement) {
		const droppable = this.droppables.find((d) => d.element === element);
		if (!droppable)
			throw this.ns.throwable('could not find droppable with given element to unregister');
		this.droppables.splice(this.droppables.indexOf(droppable));
	}

	public get isDragging() {
		return this.dragging !== undefined;
	}

	public get draggingData() {
		if (!this.isDragging) throw this.ns.throwable('nothing is being dragged at this moment');
		return this.dragging;
	}

	private onMouseDown(e: MouseEvent) {
		if (this.isDragging) return;

		const element = e.target as HTMLElement;
		const dragger = this.getDraggerWithElement(element);
		if (!dragger) return;

		if (e.buttons == 3) {
			const ctx = new DragContext<T>(e, dragger);
			dragger.onDrag(ctx);

			if (!ctx.accepted) {
				this.ns.log('draggable denied drag');
				return;
			}

			this.ns.log('dragging');
			this.dragging = ctx;
		} else if (e.buttons == 1) {
			dragger.onClick(e);
		}
	}

	private onMouseUp = (e: MouseEvent) => {
		if (!this.dragging) return;

		const element = e.target as HTMLElement;
		const droppable = this.getDroppableWithElement(element);

		const newCtx = new DragContext<T>(e, this.dragging.dragger);
		this.dragging.forwardData(newCtx);

		if (!droppable) {
			this.ns.log('no droppable found.');
			this.handleOnDropOutside(newCtx);
		} else {
			droppable.onDrop(newCtx);

			if (!newCtx.accepted) {
				this.ns.log('droppable denied drop.');
				this.handleOnDropOutside(newCtx);
			}
		}

		this.ns.log('stopped dragging');
		this.dragging = undefined;
	};

	private handleOnDropOutside(newCtx: DragContext<T>) {
		if (!this.dragging) return;

		if (!this.dragging?.dragger.onDropOutside) {
			this.defaultOnDropOutside?.(newCtx);
			return;
		}

		this.dragging.dragger.onDropOutside(newCtx);
	}

	private getDraggerWithElement(element: HTMLElement): Dragger<T> | undefined {
		return this.draggers.find((d) => d.element === element);
	}

	private getDroppableWithElement(element: HTMLElement): Droppable<T> | undefined {
		return this.droppables.find((d) => d.element === element);
	}
}
