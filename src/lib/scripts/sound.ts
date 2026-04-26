import { makeNamespace } from './utils.svelte';

const VOLUME_MULTIPLIER = 0.2;

export interface Sound {
	fileName: string;
	volume?: number;
}

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

		audio.volume = sanitizeVolume(soundProps.volume);

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
	private ns = makeNamespace('advanced_sound', () => this.sound.fileName);
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
		this.baseVolume = sanitizeVolume(options.volume ?? options.sound.volume ?? 1);
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
		this.ns.log('playing');
	}

	pause() {
		if (!this.source) return;
		this.pauseTime = this.ctx.currentTime - this.startTime;
		this.source.stop();
		this.source = undefined;
		this.ns.log('paused');
	}

	stop() {
		if (this.source) {
			this.source.stop();
			this.source = undefined;
		}
		this.pauseTime = 0;
		this.ns.log('stopped');
	}

	setMasterVolume(vol: number) {
		this.baseVolume = sanitizeVolume(vol);
		this.masterGain.gain.setValueAtTime(this.baseVolume, this.ctx.currentTime);
	}

	fadeOut(duration = 0.25) {
		const now = this.ctx.currentTime;
		this.masterGain.gain.cancelScheduledValues(now);
		this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
		this.masterGain.gain.linearRampToValueAtTime(0, now + duration);
		this.ns.log('applying fadeOut');
	}

	fadeIn(duration = 0.25) {
		const now = this.ctx.currentTime;
		this.masterGain.gain.cancelScheduledValues(now);
		this.masterGain.gain.setValueAtTime(0, now);
		this.masterGain.gain.linearRampToValueAtTime(this.baseVolume, now + duration);
		this.ns.log('applying fadeIn');
	}

	setStereoVolume(left: number, right: number) {
		const now = this.ctx.currentTime;
		this.gainL.gain.setValueAtTime(sanitizeVolume(left, false), now);
		this.gainR.gain.setValueAtTime(sanitizeVolume(right, false), now);
	}
}

function sanitizeVolume(raw: number, withMult: boolean = true): number {
	return Math.max(raw * (withMult ? VOLUME_MULTIPLIER : 1), 0);
}
