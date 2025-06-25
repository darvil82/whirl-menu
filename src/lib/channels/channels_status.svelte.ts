import { PAGE_NUM_COLUMNS, PAGE_NUM_ROWS, type RuntimeChannel } from './channel_utils';

class MovingChannel {
	movingChannel:
		| { channel: RuntimeChannel; originalCallback: (c: RuntimeChannel) => void }
		| undefined = $state(undefined);

	get channel(): RuntimeChannel | undefined {
		return this.movingChannel?.channel;
	}

	get isMoving(): boolean {
		return this.movingChannel != undefined;
	}

	set = (status: typeof this.movingChannel) => (this.movingChannel = status);
	unset = () => (this.movingChannel = undefined);

	invokeOriginalCallback = () => this.movingChannel?.originalCallback(this.movingChannel.channel);
}

class SelectedChannel {
	selectedChannel: { channel: RuntimeChannel | undefined; isSelected: boolean } = $state({
		channel: undefined,
		isSelected: false
	});

	get channel(): RuntimeChannel | undefined {
		return this.selectedChannel?.channel;
	}

	get isSelected(): boolean {
		return this.selectedChannel.isSelected;
	}

	transformOrigin(middleOffset: boolean = false): string | undefined {
		if (!this.boundingRect) return undefined;
		const { x, y, width, height } = this.boundingRect;

		if (!middleOffset) {
			return `${x + width / 2}px ${y + height / 2}px`;
		}

		if (!this.channel) return '';

		const channelGridPos = [
			this.channel?.position[0] % PAGE_NUM_COLUMNS,
			this.channel?.position[1] % PAGE_NUM_ROWS
		];
		const incrementWidth = width / PAGE_NUM_COLUMNS;
		const incrementHeight = height / PAGE_NUM_ROWS - 10; // some tiny tweaks here and there

		return `${x + incrementWidth * channelGridPos[0]}px ${y + incrementHeight * channelGridPos[1]}px`;
	}

	get boundingRect(): DOMRect | undefined {
		return this.selectedChannel.channel?.element?.getBoundingClientRect();
	}

	set = (channel: RuntimeChannel) => {
		this.selectedChannel = {
			channel,
			isSelected: true
		};
	};
	unset = () => (this.selectedChannel.isSelected = false);
}

export const movingChannel = new MovingChannel();
export const selectedChannel = new SelectedChannel();
