import type { Snippet } from 'svelte';

type TrayAnimation = 'slide' | 'rotate';

interface TrayData {
	content: Snippet;
	animation: TrayAnimation;
}

class MenuTraysHandler {
	private leftData: TrayData | undefined = $state();
	private rightData: TrayData | undefined = $state();

	public setLeftData = (data: TrayData) => {
		this.leftData = data;
	};

	public setRightData = (data: TrayData) => {
		this.rightData = data;
	};

	public getData = (side: 'left' | 'right') => {
		return side === 'left' ? this.leftData : this.rightData;
	};
}

export const menuTraysHandler = new MenuTraysHandler();
