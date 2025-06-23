import type { ChannelDef } from '../../lib/channels_def/channels_def';

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
	selectedChannel: { channel: ChannelDef; absPos: [number, number] } | undefined =
		$state(undefined);

	get channel(): ChannelDef | undefined {
		return this.selectedChannel?.channel;
	}

	get isSelected(): boolean {
		return this.selectedChannel != undefined;
	}

	get transformOrigin(): string {
		if (!this.selectedChannel) return 'unset';
		const [x, y] = this.selectedChannel.absPos;
		return `${x}px ${y}px`;
	}

	set = (status: typeof this.selectedChannel) => (this.selectedChannel = status);
	unset = () => (this.selectedChannel = undefined);
}

export const movingChannel = new MovingChannel();
export const selectedChannel = new SelectedChannel();
