import SOUNDS from '$lib/assets/sounds/soundsDefinition';
import { ellipsize, type AnchorPosition } from '$lib/scripts/utils.svelte';
import type { Attachment } from 'svelte/attachments';
import { SimpleSound } from '../sound';

interface BalloonOptions {
	anchor?: AnchorPosition;
	offset?: [number, number];
}

function createBalloonElement(options: BalloonOptions & { label: string }) {
	const bubble = document.createElement('div');
	bubble.classList.add('bubble', options.anchor ?? 'center');

	if (options.offset) {
		bubble.style.setProperty('--offset-x', options.offset[0].toString());
		bubble.style.setProperty('--offset-x', options.offset[0].toString());
	}

	bubble.textContent = ellipsize(options.label, 30);

	return bubble;
}

export function balloon(
	label: string,
	show: boolean,
	options: BalloonOptions
): Attachment<HTMLElement> {
	return (element) => {
		if (!show) return;

		let hoverTimeout: number;
		const balloon = createBalloonElement({ label, ...options });

		function mouseover(e: MouseEvent) {
			hoverTimeout = setTimeout(() => {
				balloon.classList.add('visible');
				SimpleSound.play(SOUNDS.MISC.balloon);
			}, 350);
		}

		function mouseleave(e: MouseEvent) {
			clearTimeout(hoverTimeout);
			balloon.classList.remove('visible');
		}

		element.addEventListener('mouseover', mouseover);
		element.addEventListener('mouseleave', mouseleave);
		element.appendChild(balloon);

		return () => {
			element.removeEventListener('mouseover', mouseover);
			element.removeEventListener('mouseleave', mouseleave);
			balloon.remove();
		};
	};
}
