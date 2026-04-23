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
		error: { fileName: error, volume: 0.25 },
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

/*
Uses the web audio api to create a playing sound instance that can be controlled much more tightly.
Constructs the next nodes in the order specified:

	  Sound Buffer
		   |
		   |
	    Splitter
		 /     \
	    /	    \
	Gain (L)  Gain (R)
		\		/
		 \	   /
		  Merger
		    |
			|
	   Gain (Master)
			|
			|
		   Out

The usage of the l and r gain nodes is completely optional
*/
export class AdvancedSound {
	private ctx = new AudioContext();
	private sound: Sound;

	private buffer?: AudioBuffer;
	private source?: AudioBufferSourceNode;
	private baseVolume: number = 0;

	private splitter = this.ctx.createChannelSplitter(2);
	private merger = this.ctx.createChannelMerger(2);

	private gainL = this.ctx.createGain();
	private gainR = this.ctx.createGain();
	private masterGain = this.ctx.createGain();

	private startTime = 0;
	private pauseTime = 0;
	private loop?: { start: number; end: number };

	constructor(options: { sound: Sound; volume?: number; loop?: { start: number; end: number } }) {
		this.baseVolume = (options.volume ?? options.sound.volume ?? 1) * VOLUME_MULTIPLIER;
		this.sound = options.sound;
		this.loop = options.loop;

		// initialize per-channel values
		this.gainL.gain.value = 1;
		this.gainR.gain.value = 1;

		// master gain defaults to 1 (you can treat this as a multiplier)
		this.masterGain.gain.value = this.baseVolume;

		// splitter -> gains -> merger -> master -> output
		this.splitter.connect(this.gainL, 0);
		this.splitter.connect(this.gainR, 1);

		this.gainL.connect(this.merger, 0, 0);
		this.gainR.connect(this.merger, 0, 1);

		this.merger.connect(this.masterGain);
		this.masterGain.connect(this.ctx.destination);

		// load audio buffer asynchronously
		fetch(this.sound.fileName)
			.then((res) => res.arrayBuffer())
			.then((data) => this.ctx.decodeAudioData(data))
			.then((buffer) => (this.buffer = buffer));
	}

	private createSource(offset: number = 0) {
		if (!this.buffer) return;

		const src = this.ctx.createBufferSource();
		src.buffer = this.buffer;

		if (this.loop) {
			src.loop = true;
			src.loopStart = this.loop.start;
			src.loopEnd = this.loop.end;
		}

		// connect fresh source to splitter
		src.connect(this.splitter);

		src.start(0, offset);
		this.startTime = this.ctx.currentTime - offset;
		this.source = src;
	}

	play() {
		if (!this.buffer) return;
		if (this.source) this.stop();
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

	setMasterVolume(vol: number) {
		this.masterGain.gain.setValueAtTime(vol * VOLUME_MULTIPLIER, this.ctx.currentTime);
	}

	fadeOut(duration = 0.25) {
		const now = this.ctx.currentTime;
		this.masterGain.gain.cancelScheduledValues(now);
		this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
		this.masterGain.gain.linearRampToValueAtTime(0, now + duration);
	}

	fadeIn(duration = 0.25) {
		const now = this.ctx.currentTime;
		this.masterGain.gain.cancelScheduledValues(now);
		this.masterGain.gain.setValueAtTime(0, now);
		this.masterGain.gain.linearRampToValueAtTime(this.baseVolume, now + duration);
	}

	setStereoVolume(left: number, right: number) {
		const now = this.ctx.currentTime;
		this.gainL.gain.setValueAtTime(left, now);
		this.gainR.gain.setValueAtTime(right, now);
	}
}

export default SOUNDS;
