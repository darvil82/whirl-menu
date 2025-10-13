import { DraggableEnvironment } from '$lib/scripts/draggables.svelte';
import { Channels, PAGE_NUM_COLUMNS, PAGE_NUM_ROWS, RuntimeChannel } from './channels';

class SelectedChannel {
	private selectedChannel: { channel: RuntimeChannel | undefined; isSelected: boolean } = $state({
		channel: undefined,
		isSelected: false
	});
	_isBannerShown = $state(false);
	_isFullyFocused = $state(false);

	get channel(): RuntimeChannel | undefined {
		return this.selectedChannel?.channel;
	}

	get isSelected(): boolean {
		return this.selectedChannel.isSelected;
	}

	get bannerShown(): boolean {
		return this._isBannerShown;
	}

	get fullyFocused(): boolean {
		return this._isFullyFocused;
	}

	transformOrigin = (middleOffset: boolean = false): string | undefined => {
		if (!this.channel) return undefined;
		const { width: channelWidth, height: channelHeight } = Channels.getChanneDOMRect();

		if (!middleOffset) {
			const [x, y] = this.channel.getCSSPos();

			return `${x + channelWidth}px ${y + channelHeight}px`; // for some stupid reason we need to offset
		}

		const [x, y] = this.channel.getCSSPos(true);

		const channelLocalGridPos = this.channel.getPosLocalGrid();
		const incrementWidth = (channelWidth + 10) / PAGE_NUM_COLUMNS;
		const incrementHeight = (channelHeight - 30) / PAGE_NUM_ROWS; // some tiny tweaks here and there

		return `${x + incrementWidth * channelLocalGridPos[0]}px ${y + incrementHeight * channelLocalGridPos[1]}px`;
	};

	set = (channel: RuntimeChannel) => {
		this.selectedChannel = {
			channel,
			isSelected: true
		};
	};

	unset = () => (this.selectedChannel.isSelected = false);
}

export const movingChannels = new DraggableEnvironment<RuntimeChannel>('channels');
export const selectedChannel = new SelectedChannel();
