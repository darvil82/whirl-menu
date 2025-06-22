export function ellipsize(str: string, maxSize: number): string {
	if (str.length <= maxSize) return str;

	return str.substring(0, maxSize - 3) + '...';
}

let mousePos: [number, number] | undefined = $state(undefined);

export function getMousePosition() {
	return mousePos;
}

export function setMousePosition(m: typeof mousePos) {
	mousePos = m;
}

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
