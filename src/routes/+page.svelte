<script>
	import MenuButton from '$lib/components/MenuButton.svelte';
	import { ButtonSoundType } from '$lib/sounds/sound_types';
	import ChannelPanel from './channels/ChannelPanel.svelte';
</script>

<div class="menu">
	<ChannelPanel></ChannelPanel>
</div>
<br /><br /><br /><br /><br />
<center>
	<MenuButton clickSound={ButtonSoundType.BACK}>Menú de Wii</MenuButton>
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
	<MenuButton>Comenzar</MenuButton>
</center>
