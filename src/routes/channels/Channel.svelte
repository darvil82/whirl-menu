<div class="channel">
	<div class="content"></div>
</div>

<style lang="scss">
	.channel {
		background: utils.$color-gray;
		height: 10rem;
		mask: url('./channel_mask.png');
		mask-size: 100% 100%;
		position: relative;

		.content {
			position: absolute;
			inset: 0.25rem;
			background: white;
			mask: url('./channel_mask.png');
			mask-size: 100% 100%;
		}
	}
</style>
