import { makeNamespace } from '$lib/scripts/utils.svelte';
import balloon from './balloon.wav';
import cancel from './button/cancel.wav';
import click1 from './button/click1.wav';
import click2 from './button/click2.wav';
import hover from './button/hover.wav';
import drag from './channel/drag.wav';
import drop from './channel/drop.wav';
import hold from './channel/hold.wav';
import scroll_page from './channel/scroll_page.wav';
import zoom_in from './channel/zoom_in.wav';
import zoom_out from './channel/zoom_out.wav';
import error from './error.wav';
import music from './music.wav';

const VOLUME_MULTIPLIER = 0.2;

export interface Sound {
	fileName: string;
	volume?: number;
}

export const SOUNDS = {
	BUTTON: {
		click1: { fileName: click1 },
		click2: { fileName: click2 },
		cancel: { fileName: cancel },
		hover: { fileName: hover, volume: 0.25 }
	},
	CHANNEL: {
		scroll_page: { fileName: scroll_page },
		hold: { fileName: hold },
		drop: { fileName: drop },
		zoomIn: { fileName: zoom_in },
		zoomOut: { fileName: zoom_out },
		drag: { fileName: drag }
	},
	MUSIC: {
		main: { fileName: music }
	},
	MISC: {
		error: { fileName: error, volume: 0.5 },
		balloon: { fileName: balloon }
	}
} satisfies { [category: string]: { [soundName: string]: Sound } };

export class SimpleSound {
	private static ns = makeNamespace('simple_sound');
	private constructor() {}

	static play(sound: Sound, volumeOverride?: number) {
		const soundProps = { ...sound, volume: volumeOverride ?? sound.volume ?? 1 };

		const audio = new Audio(sound.fileName);
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

		fetch(this.sound.fileName)
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
			.catch((e) => {
				throw this.ns.throwable(`Failed to load sound: ${options.sound.fileName}, Error: ${e}`);
			});
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
