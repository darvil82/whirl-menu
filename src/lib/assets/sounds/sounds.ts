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

export class AdvancedSound {
	private ctx = new AudioContext();
	private sound: Sound;
	private gainNode = this.ctx.createGain();
	private buffer?: AudioBuffer;
	private source?: AudioBufferSourceNode;
	private volume: number;
	private startTime = 0; // when playback started
	private pauseTime = 0; // where it was paused (in seconds)
	private loop?: { start: number; end: number };

	constructor(options: { sound: Sound; volume?: number; loop?: { start: number; end: number } }) {
		this.sound = options.sound;
		this.volume = (options.volume ?? options.sound.volume ?? 1) * VOLUME_MULTIPLIER;
		this.gainNode.gain.value = this.volume;
		this.gainNode.connect(this.ctx.destination);
		this.loop = options.loop;

		// load and decode the sound
		fetch(this.sound.fileName)
			.then((res) => res.arrayBuffer())
			.then((data) => this.ctx.decodeAudioData(data))
			.then((buffer) => (this.buffer = buffer));
	}

	private createSource(startOffset: number = 0) {
		if (!this.buffer) return;
		const src = this.ctx.createBufferSource();
		src.buffer = this.buffer;
		if (this.loop) {
			src.loop = true;
			src.loopStart = this.loop.start;
			src.loopEnd = this.loop.end;
		}
		src.connect(this.gainNode);
		src.start(0, startOffset);
		this.startTime = this.ctx.currentTime - startOffset;
		this.source = src;
	}

	play() {
		if (!this.buffer) return;
		if (this.source) this.stop(); // just in case
		this.createSource(this.pauseTime);
	}

	pause() {
		if (!this.source) return;
		this.pauseTime = this.ctx.currentTime - this.startTime;
		this.source.stop();
		this.source = undefined;
	}

	stop() {
		if (this.source) {
			this.source.stop();
			this.source = undefined;
		}
		this.pauseTime = 0;
	}

	fadeOut(duration = 0.25) {
		const now = this.ctx.currentTime;
		this.gainNode.gain.cancelScheduledValues(now);
		this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
		this.gainNode.gain.linearRampToValueAtTime(0, now + duration);
	}

	fadeIn(duration = 0.25) {
		const now = this.ctx.currentTime;
		this.gainNode.gain.cancelScheduledValues(now);
		this.gainNode.gain.setValueAtTime(0, now);
		this.gainNode.gain.linearRampToValueAtTime(this.volume, now + duration);
	}

	setVolume(volume: number) {
		this.volume = volume * VOLUME_MULTIPLIER;
		this.gainNode.gain.value = this.volume;
	}
}

export const systemMenuMusic = new AdvancedSound({
	sound: SOUNDS.MUSIC.main,
	volume: 0,
	loop: { start: 27.716, end: 34.968 + 1 * 60 }
});

export default SOUNDS;
