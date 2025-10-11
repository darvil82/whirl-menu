export type Direction1D = 'left' | 'right';
export type AnchorPosition = Direction1D | 'center';

export function ellipsize(str: string, maxSize: number): string {
	if (str.length <= maxSize) return str;

	return str.substring(0, maxSize - 3) + '...';
}

class Mouse {
	private pos: [number, number] | undefined = $state();
	private inView = $state(true);
	_isDragging = $state(false);

	public constructor() {
		document.addEventListener('mousemove', this.onMove);
		document.addEventListener('mouseleave', this.onHide);
		document.addEventListener('mouseenter', this.onShow);
	}

	public detach() {
		document.removeEventListener('mousemove', this.onMove);
		document.removeEventListener('mouseleave', this.onHide);
		document.removeEventListener('mouseenter', this.onShow);
	}

	private onHide = () => {
		this.inView = false;
	};

	private onShow = () => {
		this.inView = true;
	};

	private onMove = (e: MouseEvent) => {
		this.pos = [e.x, e.y];
	};

	get position() {
		return this.pos ?? [0, 0];
	}

	get isVisible() {
		return this.pos !== undefined && this.inView;
	}

	get dragging() {
		return this._isDragging;
	}
}

export const mouse = new Mouse();

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
		if (inThrottle) return;
		func(...args);
		inThrottle = true;
		setTimeout(() => (inThrottle = false), limit);
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
		throwable: (msg: string) => new Error(`${getHeading(namespace, extra)} ${msg}`)
	};
}

export function getRandomId() {
	return (
		(Math.random() * 10).toString().replace('.', '') +
		(Math.random() * 10).toString().replace('.', '')
	);
}
