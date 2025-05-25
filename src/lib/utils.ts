import { playSound, type Sound } from './sounds/sounds';

export function ellipsize(str: string, maxSize: number): string {
	if (str.length <= maxSize) return str;

	return str.substring(0, maxSize - 3) + '...';
}

export function playSoundTimes(
	sound: Sound,
	times: number,
	delay: number,
	volumeOverride?: number
) {
	if (times < 1) return;
	playSound(sound, volumeOverride);

	for (let x = 1; x < times; x++) {
		setTimeout(() => {
			playSound(sound, volumeOverride);
		}, delay * x);
	}
}
