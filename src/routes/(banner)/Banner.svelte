<script lang="typescript">
	import SOUNDS, { SimpleSound, systemMenuMusic } from '$lib/assets/sounds/sounds';
	import { channels, PAGE_SCROLL_DELAY } from '$lib/channels/channel_utils';
	import MenuButton from '$lib/components/MenuButton.svelte';
	import { throttle } from '$lib/scripts/utils.svelte';
	import { untrack } from 'svelte';
	import { selectedChannel } from '../../lib/channels/channels_status.svelte';
	import ScrollArrow from '../../lib/components/ScrollArrow.svelte';

	let zoom = $state(false);
	let render = $state(false);
	let showArrows = $state(false);

	function zoomIn() {
		if (render) return;
		render = true;
		channels.updateOrdered();
		systemMenuMusic.fadeOut();

		setTimeout(() => {
			zoom = true;
			SimpleSound.play(SOUNDS.CHANNEL.zoomIn);
		}, 100);

		setTimeout(() => {
			showArrows = true;
		}, 750);
	}

	function zoomOut() {
		if (!render) return;
		zoom = false;
		showArrows = false;
		SimpleSound.play(SOUNDS.CHANNEL.zoomOut);
		systemMenuMusic.fadeIn(3);

		setTimeout(() => {
			render = false;
		}, 750);
	}

	const changeChannel = throttle((direction: 'left' | 'right') => {
		selectedChannel.set(channels.getNext(selectedChannel.channel!, direction));
		SimpleSound.play(SOUNDS.CHANNEL.scroll_page);
	}, PAGE_SCROLL_DELAY);

	$effect(() => {
		const func = selectedChannel.isSelected ? zoomIn : zoomOut;
		untrack(func);
	});
</script>

{#if render}
	<ScrollArrow position={'left'} show={showArrows} onclick={() => changeChannel('left')} />
	<ScrollArrow position={'right'} show={showArrows} onclick={() => changeChannel('right')} />
	<div class="banner-wrapper" class:zoom>
		<div
			class="content"
			style:transform-origin={selectedChannel.transformOrigin()}
			class:interactable={showArrows}
		>
			<div class="banner">
				<div class="sandbox">
					{#if selectedChannel.channel}
						<selectedChannel.channel.banner />
					{/if}
				</div>
			</div>
			<div class="options">
				<MenuButton clickSound={SOUNDS.BUTTON.click2} onclick={selectedChannel.unset}
					>Menú de Wii</MenuButton
				>
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
		height: 100vh;

		$duration: 0.5s;
		$tfunction-in: cubic-bezier(0.55, 0.055, 0.675, 0.19);
		$tfunction-out: cubic-bezier(0.215, 0.61, 0.355, 1);

		&,
		.content {
			transition:
				scale $duration $tfunction-out,
				translate $duration $tfunction-out,
				padding $duration $tfunction-out,
				opacity $duration,
				background $duration;
		}

		.content {
			position: relative;
			display: flex;
			flex-direction: column;
			margin: 0em;
			mask: url('$lib/assets/images/channels/channel_mask_hr.png');
			mask-size: 100% 100%;
			scale: 0.16;
			translate: 0.6em -0.6em;
			will-change: contents;
			opacity: 0;

			&:not(.interactable) {
				mask: url('$lib/assets/images/channels/channel_mask_lr.png'); // switch to high res mask when finally zommed in
				mask-size: 100% 100%;
				pointer-events: none;
			}

			.banner {
				place-content: center;
				position: relative;
				flex-grow: 1;

				.sandbox {
					position: absolute;
					inset: 0;
				}
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
				translate: 0 0;
			}

			&,
			.content {
				transition:
					scale $duration $tfunction-in,
					translate $duration $tfunction-in,
					padding $duration $tfunction-in,
					opacity $duration,
					background $duration;
			}
		}
	}
</style>
