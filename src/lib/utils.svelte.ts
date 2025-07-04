import type { Attachment } from 'svelte/attachments';
import SOUNDS, { playSound } from './assets/sounds/sounds';

export type Direction1D = 'left' | 'right';
export type AnchorPosition = Direction1D | 'center';

export function ellipsize(str: string, maxSize: number): string {
	if (str.length <= maxSize) return str;

	return str.substring(0, maxSize - 3) + '...';
}

class Mouse {
	private pos: [number, number] | undefined = $state();
	private inView = $state(true);

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

export function bubble(
	label: string,
	show: boolean,
	options: {
		anchor?: AnchorPosition;
		offset?: [number, number];
	}
): Attachment {
	return (element) => {
		if (!(element instanceof HTMLElement)) return;

		const bubble = document.createElement('div');
		let hoverTimeout: number;
		bubble.classList.add('bubble', options.anchor ?? 'center');

		if (options.offset) {
			bubble.style.setProperty('--offset-x', options.offset[0].toString());
			bubble.style.setProperty('--offset-x', options.offset[0].toString());
		}

		bubble.textContent = ellipsize(label, 30);

		function mouseover(e: MouseEvent) {
			if (!show) return;
			hoverTimeout = setTimeout(() => {
				bubble.classList.add('visible');
				playSound(SOUNDS.MISC.balloon);
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
