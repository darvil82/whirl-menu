<script lang="ts">
	import { time } from '$lib/scripts/time.svelte';
</script>

<span class="date"> {time.dateFormatted} </span>

<style lang="scss">
	.date {
		color: $color-dark;
		font-size: 5vh;
		font-weight: bold;
	}
</style>
