import SOUNDS from '$lib/assets/sounds/soundsDefinition';
import { SimpleSound, type Sound } from '$lib/scripts/sound';
import type { Snippet } from 'svelte';

export interface ButtonProps {
	children: Snippet;
	disabled?: boolean;
	noBorder?: boolean;
	clickSound?: Sound;
	onclick?: (e: MouseEvent) => void;
	delayedClick?: boolean;
}

const BUTTON_DELAYED_CLICK_TIME = 150;

export class ButtonBehavior {
	private clicked: boolean = $state(false);
	public props: Required<ButtonProps> = $state(undefined!);
	private _element: HTMLButtonElement = undefined!;

	constructor(props: () => ButtonProps) {
		this.props = {
			disabled: false,
			noBorder: false,
			clickSound: SOUNDS.BUTTON.click1,
			delayedClick: true,
			onclick: () => {},
			...props()
		};
	}

	public onclick = (event: MouseEvent) => {
		if (event.button !== 0) return;
		if (this.clicked) return;

		if (this.props.disabled) {
			SimpleSound.play(SOUNDS.MISC.error);
			return;
		}

		this.clicked = true;
		SimpleSound.play(this.props.clickSound);
		this.click(event);

		this._element.addEventListener(
			'animationend',
			() => {
				this.clicked = false;
			},
			{ once: true }
		);
	};

	public hover = () => {
		if (this.props.disabled || this.clicked) return;
		SimpleSound.play(SOUNDS.BUTTON.hover);
	};

	public click = (e: MouseEvent) => {
		const fn = () => this.props.onclick(e);

		if (this.props.delayedClick) {
			setTimeout(fn, BUTTON_DELAYED_CLICK_TIME);
			return;
		}

		fn();
	};

	public get isClicked() {
		return this.clicked;
	}

	public set element(element: HTMLButtonElement) {
		this._element = element;
		this.detach();
		this.attach();
	}

	public detach = () => {
		this._element?.removeEventListener('mousedown', this.onclick);
		this._element?.removeEventListener('mouseover', this.hover);
	};

	public attach = () => {
		this._element?.addEventListener('mousedown', this.onclick);
		this._element?.addEventListener('mouseover', this.hover);
	};
}
