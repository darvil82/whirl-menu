<script lang="typescript">
	import './app.scss';

	const { children } = $props();
</script>

<main>
	{@render children()}
</main>

<style lang="scss">
	main {
		overflow: hidden;
		height: 100vh;
	}
</style>
