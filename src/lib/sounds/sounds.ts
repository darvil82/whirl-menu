export interface Sound {
	fileName: string;
	volume?: number;
}

export const SOUNDS = {
	BUTTON: {
		button_click_default: { fileName: 'button_click_default.wav' },
		button_click_back: { fileName: 'button_click_back.wav' },
		button_hover: { fileName: 'button_hover.wav', volume: 0.25 }
	},
	CHANNEL: {
		hover_title: { fileName: 'hover_title.wav', volume: 0.25 }
	}
} as const satisfies { [category: string]: { [soundName: string]: Sound } };

export function playSound(sound: Sound, volumeOverride?: number) {
	const soundProps = { ...sound, volume: volumeOverride ?? sound.volume ?? 1 };

	const audio = new Audio(`./src/lib/sounds/${soundProps.fileName}`);
	audio.volume = soundProps.volume;

	audio.play();
}

export default SOUNDS;
