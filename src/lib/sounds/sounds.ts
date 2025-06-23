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
		move_page: { fileName: 'move_page.wav' },
		interact: { fileName: 'channel_interact.wav' },
		click: { fileName: 'channel_click.wav' },
		switch: { fileName: 'channel_switch.wav' },
		zoomIn: { fileName: 'channel_zoom_in.wav' },
		zoomOut: { fileName: 'channel_zoom_out.wav' }
	},
	MUSIC: {
		main: { fileName: 'music.wav' }
	}
} as const satisfies { [category: string]: { [soundName: string]: Sound } };

export function getSoundPath(sound: Sound): string {
	return `./src/lib/sounds/${sound.fileName}`;
}

export function playSound(sound: Sound, volumeOverride?: number) {
	const soundProps = { ...sound, volume: volumeOverride ?? sound.volume ?? 1 };

	const audio = new Audio(getSoundPath(sound));
	audio.volume = soundProps.volume * VOLUME_MULTIPLIER;

	console.log('playing ', soundProps);
	audio.play();
}

export default SOUNDS;
