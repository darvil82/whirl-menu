<script lang="ts">
	import MenuButton from '$lib/components/MenuButton.svelte';
	import SOUNDS from '$lib/sounds/sounds';
	import { onMount } from 'svelte';
	import ChannelPanel from './channels/ChannelPanel.svelte';

	onMount(() => {
		document.oncontextmenu = () => false;
	});
</script>

<div class="menu">
	<ChannelPanel></ChannelPanel>
</div>
<br /><br /><br /><br /><br />
<div style="display: flex; justify-content: center; gap: 5rem">
	<MenuButton clickSound={SOUNDS.BUTTON.button_click_back}>Menú de Wii</MenuButton>
	<MenuButton>Comenzar</MenuButton>
</div>
