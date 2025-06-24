const VOLUME_MULTIPLIER = 0.25;

export interface Sound {
	fileName: string;
	volume?: number;
}

export const SOUNDS = {
	BUTTON: {
		click1: { fileName: 'button/click1.wav' },
		click2: { fileName: 'button/click2.wav' },
		cancel: { fileName: 'button/cancel.wav' },
		hover: { fileName: 'button/hover.wav', volume: 0.25 }
	},
	CHANNEL: {
		scroll_page: { fileName: 'channel/scroll_page.wav' },
		hold: { fileName: 'channel/hold.wav' },
		drop: { fileName: 'channel/drop.wav' },
		zoomIn: { fileName: 'channel/zoom_in.wav' },
		zoomOut: { fileName: 'channel/zoom_out.wav' }
	},
	MUSIC: {
		main: { fileName: 'music.wav' }
	},
	MISC: {
		error: { fileName: 'error.wav', volume: 0.5 },
		balloon: { fileName: 'balloon.wav' }
	}
} as const satisfies { [category: string]: { [soundName: string]: Sound } };

export function getSoundPath(sound: Sound): string {
	return `./src/lib/sounds/${sound.fileName}`;
}

export function playSound(sound: Sound, volumeOverride?: number) {
	const soundProps = { ...sound, volume: volumeOverride ?? sound.volume ?? 1 };

	const audio = new Audio(getSoundPath(sound));
	if (!audio) {
		console.error('[sound] Failed to play:', soundProps);
		return;
	}

	audio.volume = soundProps.volume * VOLUME_MULTIPLIER;

	console.log('[sound] Playing ', soundProps);
	audio.play();
}

export default SOUNDS;
