import type { Sound } from '$lib/scripts/sound';
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

export default SOUNDS;
