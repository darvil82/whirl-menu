<script>
	import Test from '$lib/channels_def/Test.svelte';
	import MenuButton from '$lib/components/MenuButton.svelte';
	import SOUNDS from '$lib/sounds/sounds';
</script>

<div class="banner-wrapper">
	<div class="content">
		<div class="banner">
			<Test></Test>
		</div>
		<div class="options">
			<MenuButton clickSound={SOUNDS.CHANNEL.click}>Menú de Wii</MenuButton>
			<MenuButton>Comenzar</MenuButton>
		</div>
	</div>
</div>

<style lang="scss">
	.banner-wrapper {
		position: fixed;
		display: grid;
		inset: 0;
		background-color: black;

		.content {
			position: relative;
			display: flex;
			flex-direction: column;
			margin: 1em;
			mask: url('../\(channels\)/assets/channel_mask.png');
			mask-size: 100% 100%;

			.banner {
				position: relative;
				flex-basis: 100%;
			}

			.options {
				$gradient: radial-gradient(50vw, rgba(255, 255, 255, 0.5), transparent);
				position: relative;
				display: flex;
				justify-content: center;
				gap: 5em;
				padding: 2.4em;
				padding-top: 1em;
				background: $gradient, lines-repeating-gradient(#cecec4, #e4e4e1);

				&::before {
					$curvature: 0.32em;
					$border: 0.1em;
					position: absolute;
					content: '';
					inset-inline: -2%;
					top: -$curvature;
					height: $curvature * 2;
					clip-path: polygon(
						0 -100%,
						100% -100%,
						100% 52%,
						0 52%
					); // 53 seems to work fine at the edge of the bottom
					background: $gradient, #cecec4;
					// background: black;
					border-top-left-radius: 50%;
					border-top-right-radius: 50%;
					box-shadow: 0 -#{$border} 0 0 black;
				}
			}
		}
	}
</style>
