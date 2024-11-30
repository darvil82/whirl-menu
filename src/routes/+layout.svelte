<script lang="ts">
	import './app.scss';

	const { children } = $props();
</script>

<main>
	{@render children()}
</main>
