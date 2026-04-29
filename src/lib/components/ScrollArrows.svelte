<script>
	import { Menu } from '$lib/scripts/menu/menu';
	import SideArrow from './SideArrow.svelte';

	const scrollArrows = Menu.instance().scrollArrows;
</script>

{#if scrollArrows.def}
	<SideArrow position={'left'} show={scrollArrows.shouldShow('left')} onclick={() => {}} />
	<SideArrow position={'right'} onclick={() => {}} />
{/if}
