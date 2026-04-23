<script lang="typescript">
	import type { ChannelThumbnailData } from '$lib/scripts/menu/channels/channel';

	const props: ChannelThumbnailData = $props();
</script>

<div class="c">
	<h2>Test channel</h2>
</div>

<style lang="scss">
	.c {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);

		h2 {
			animation: dance 3s infinite;

			@keyframes dance {
				100% {
					transform: rotate(0deg);
				}
				25% {
					transform: rotate(5deg);
				}
				50% {
					transform: rotate(-5deg);
				}
				75% {
					transform: rotate(5deg);
				}
			}
		}
	}
</style>
