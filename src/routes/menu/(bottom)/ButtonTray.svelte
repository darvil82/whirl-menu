<script lang="ts">
	import CircleButton from '$lib/components/CircleButton.svelte';

	const props: { position: 'left' | 'right' } = $props();
</script>

<div class="tray">
	<CircleButton>?</CircleButton>
</div>

<style lang="scss">
	.tray {
		background: rgb(102, 102, 102);
		padding: 1vh;
		padding-left: 6vw;
		border-top-right-radius: 10vh;
		border-bottom-right-radius: 10vh;
	}
</style>
