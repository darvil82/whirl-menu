import { makeNamespace } from '$lib/utils.svelte';

const VOLUME_MULTIPLIER = 0.2;

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
		zoomOut: { fileName: 'channel/zoom_out.wav' },
		drag: { fileName: 'channel/drag.wav' }
	},
	MUSIC: {
		main: { fileName: 'music.wav' }
	},
	MISC: {
		error: { fileName: 'error.wav', volume: 0.5 },
		balloon: { fileName: 'balloon.wav' }
	}
} as const satisfies { [category: string]: { [soundName: string]: Sound } };

export class SimpleSound {
	private static ns = makeNamespace('simple_sound');
	private constructor() {}

	static getSoundPath(sound: Sound): string {
		return `./src/lib/assets/sounds/${sound.fileName}`;
	}

	static play(sound: Sound, volumeOverride?: number) {
		const soundProps = { ...sound, volume: volumeOverride ?? sound.volume ?? 1 };

		const audio = new Audio(SimpleSound.getSoundPath(sound));
		if (!audio) {
			SimpleSound.ns.error('Failed to play:', soundProps);
			return;
		}

		audio.volume = soundProps.volume * VOLUME_MULTIPLIER;

		SimpleSound.ns.log('Playing:', soundProps);
		audio.play();
	}
}

class AdvancedSound {
	private ctx: AudioContext;
	private sound: Sound;
	private gainNode: GainNode;
	private source: AudioBufferSourceNode | undefined;
	private volume: number;

	private ns = makeNamespace('advanced_sound', () => this.sound.fileName);

	public constructor(options: {
		sound: Sound;
		volume?: number;
		loop?: { start: number; end: number };
	}) {
		this.ctx = new AudioContext();
		this.gainNode = this.ctx.createGain();
		this.volume = (options.volume ?? options.sound.volume ?? 1) * VOLUME_MULTIPLIER;
		this.gainNode.gain.value = this.volume;
		this.sound = options.sound;

		fetch(SimpleSound.getSoundPath(options.sound))
			.then((response) => response.arrayBuffer())
			.then((data) => this.ctx.decodeAudioData(data))
			.then((buffer) => {
				this.source = this.ctx.createBufferSource();
				this.source.buffer = buffer;

				if (options.loop) {
					this.source.loop = true;
					this.source.loopStart = options.loop.start;
					this.source.loopEnd = options.loop.end;
				}

				this.source.connect(this.gainNode).connect(this.ctx.destination);
			})
			.catch((e) => this.ns.throw(`Failed to load sound: ${options.sound.fileName}, Error: ${e}`));
	}

	start() {
		this.source?.start();
		this.ns.log('Started playing');
	}

	stop() {
		this.source?.stop();
		this.ns.log('Stopped playing');
	}

	fadeOut(duration: number = 0.25) {
		if (!this.source) return;
		this.ns.log('Fading out');
		const currentTime = this.ctx.currentTime;
		this.gainNode.gain.cancelScheduledValues(currentTime);

		this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, currentTime);
		this.gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);
	}

	fadeIn(duration: number = 0.25) {
		if (!this.source) return;
		this.ns.log('Fading in');
		const currentTime = this.ctx.currentTime;
		this.gainNode.gain.cancelScheduledValues(currentTime);

		this.gainNode.gain.setValueAtTime(0, currentTime);
		this.gainNode.gain.linearRampToValueAtTime(this.volume, currentTime + duration);
	}

	pause() {
		this.ctx.suspend();
	}

	resume() {
		this.ctx.resume();
	}
}

export const systemMenuMusic = new AdvancedSound({
	sound: SOUNDS.MUSIC.main,
	volume: 0,
	loop: { start: 27.716, end: 34.968 + 1 * 60 }
});

export default SOUNDS;
