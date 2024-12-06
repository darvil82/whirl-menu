<script lang="ts">
	import './app.scss';

	const { children } = $props();

	export const prerender = true;
</script>

<main>
	{@render children()}
</main>

<style lang="scss">
	main {
		overflow: hidden;
	}
</style>
