<script lang="ts">
	import { time } from '$lib/scripts/time.svelte';
</script>

<span class="date"> {time.dateFormatted} </span>

<style lang="scss">
	.date {
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% calc(-50% + 50%);
		color: $color-dark;
		font-size: 5vh;
		font-weight: 500;
	}
</style>
