import type { Snippet } from 'svelte';

export type TrayAnimation = 'slide' | 'rotate' | 'rotate-reversed' | 'none';

interface TrayData {
	content: Snippet;
	animation: TrayAnimation;
}

export class MenuTraysHandler {
	private leftData: TrayData | undefined = $state();
	private rightData: TrayData | undefined = $state();

	public setLeftData = (content: Snippet, animation?: TrayAnimation) => {
		this.leftData = { content, animation: animation ?? 'none' };
	};

	public setRightData = (content: Snippet, animation?: TrayAnimation) => {
		this.rightData = { content, animation: animation ?? 'none' };
	};

	public getData = (side: 'left' | 'right') => {
		return side === 'left' ? this.leftData : this.rightData;
	};
}
