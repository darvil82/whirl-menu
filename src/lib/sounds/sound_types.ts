export enum ButtonSoundType {
	DEFAULT = 'button_click_default',
	BACK = 'button_click_back',
	HOVER = 'button_hover'
}

export function playSound(soundName: string) {
	new Audio(`./src/lib/sounds/${soundName}.wav`).play();
}
