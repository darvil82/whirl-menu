import type { ChannelDef } from './channels_def';

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

export const movingChannel = new MovingChannel();
