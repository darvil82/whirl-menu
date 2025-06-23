import {
	PAGE_NUM_COLUMNS,
	PAGE_NUM_ROWS,
	type ChannelDef
} from '../../lib/channels_def/channels_def';

class MovingChannel {
	movingChannel: { channel: ChannelDef; originalCallback: (c: ChannelDef) => void } | undefined =
		$state(undefined);

	get channel(): ChannelDef | undefined {
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
	selectedChannel: { channel: ChannelDef | undefined; boundingRect: DOMRect; isSelected: boolean } =
		$state({
			channel: undefined,
			boundingRect: {
				left: 0,
				top: 0,
				width: 0,
				height: 0,
				x: 0,
				y: 0,
				bottom: 0,
				right: 0,
				toJSON: () => ''
			},
			isSelected: false
		});

	get channel(): ChannelDef | undefined {
		return this.selectedChannel?.channel;
	}

	get isSelected(): boolean {
		return this.selectedChannel.isSelected;
	}

	transformOrigin(middleOffset: boolean = false): string {
		const { x, y, width, height } = this.selectedChannel.boundingRect;

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

	get boundingRect(): DOMRect {
		return this.selectedChannel.boundingRect!;
	}

	set = (status: { channel: ChannelDef; boundingRect: DOMRect }) => {
		this.selectedChannel = {
			channel: status.channel,
			boundingRect: status.boundingRect,
			isSelected: true
		};
	};
	unset = () => (this.selectedChannel.isSelected = false);
}

export const movingChannel = new MovingChannel();
export const selectedChannel = new SelectedChannel();
