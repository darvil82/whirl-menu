<script>
	import MenuButton from '$lib/components/MenuButton.svelte';
	import SOUNDS from '$lib/sounds/sounds';
	import { fade } from 'svelte/transition';
	import { selectedChannel } from '../(channels)/channels_status.svelte';

	let zoom = $state(false);
	let render = $state(false);

	function goBack() {
		selectedChannel.unset();
	}

	function zoomIn() {
		render = true;

		setTimeout(() => {
			zoom = true;
		}, 50);
	}

	function zoomOut() {
		zoom = false;

		setTimeout(() => {
			render = false;
		}, 1000);
	}

	$effect(() => {
		selectedChannel.isSelected ? zoomIn() : zoomOut();
	});
</script>

{#if render}
	<div class="banner-wrapper" class:zoom>
		<div class="content" style:transform-origin={selectedChannel.transformOrigin}>
			<div class="banner">
				{#if selectedChannel.channel}
					<selectedChannel.channel.banner />
				{/if}
			</div>
			<div class="options">
				<MenuButton clickSound={SOUNDS.CHANNEL.click} onclick={goBack}>Menú de Wii</MenuButton>
				<MenuButton>Comenzar</MenuButton>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.banner-wrapper {
		position: fixed;
		display: grid;
		inset: 0;
		scale: 1.19;
		padding: 0em;

		&,
		.content {
			transition:
				all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1),
				opacity 0.15s 0.4s;
		}

		.content {
			position: relative;
			display: flex;
			flex-direction: column;
			margin: 0em;
			mask: url('./banner_mask.png');
			mask-size: 100% 100%;
			scale: 0.16;
			opacity: 0;

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

		&.zoom {
			scale: 1;
			background: black;
			padding: 1em;

			.content {
				scale: 1;
				opacity: 1;
			}

			&,
			.content {
				transition:
					all 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19),
					opacity 0.1s;
			}
		}
	}
</style>
