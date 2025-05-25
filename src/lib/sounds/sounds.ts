const VOLUME_MULTIPLIER = 0.25;

export interface Sound {
	fileName: string;
	volume?: number;
}

export const SOUNDS = {
	BUTTON: {
		click_default: { fileName: 'button_click_default.wav' },
		click_back: { fileName: 'button_click_back.wav' },
		hover: { fileName: 'button_hover.wav', volume: 0.25 },
		error: { fileName: 'error.wav', volume: 0.25 }
	},
	CHANNEL: {
		hover_title: { fileName: 'hover_title.wav', volume: 0.25 },
		move_page: { fileName: 'move-page.wav' }
	}
} as const satisfies { [category: string]: { [soundName: string]: Sound } };

export function playSound(sound: Sound, volumeOverride?: number) {
	const soundProps = { ...sound, volume: volumeOverride ?? sound.volume ?? 1 };

	const audio = new Audio(`./src/lib/sounds/${soundProps.fileName}`);
	audio.volume = soundProps.volume * VOLUME_MULTIPLIER;

	console.log('playing ', soundProps);
	audio.play();
}

export default SOUNDS;
