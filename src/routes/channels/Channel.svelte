<script lang="ts">
	import type { Component } from 'svelte';
	import DefaultThumbnail from './channels_def/default_thumbnail/DefaultThumbnail.svelte';

	const { thumbnail: Thumbnail }: { thumbnail?: Component } = $props();
</script>

<div class="channel" class:active={Thumbnail}>
	<div class="content">
		{#if Thumbnail}
			<Thumbnail />
		{:else}
			<DefaultThumbnail />
		{/if}
	</div>
</div>

<style lang="scss">
	.channel {
		background: utils.$color-gray;
		mask: url('./channel_mask.png');
		mask-size: 100% 100%;
		position: relative;
		overflow: hidden;

		.content {
			position: absolute;
			inset: 0.25rem;
			background: white;
			mask: url('./channel_mask.png');
			mask-size: 100% 100%;
		}

		&.active {
			cursor: pointer;
		}
	}
</style>
