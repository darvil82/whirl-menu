<script lang="typescript">
	import SOUNDS, { SimpleSound } from '$lib/assets/sounds/sounds';
	import Button from '$lib/components/button/Button.svelte';
	import ScrollArrow from '$lib/components/ScrollArrow.svelte';
	import { PAGE_SCROLL_DELAY } from '$lib/scripts/menu/channels/runtimeChannel';
	import { menu } from '$lib/scripts/menu/menu';
	import { throttle } from '$lib/scripts/utils.svelte';
	import { untrack } from 'svelte';

	let zoom = $state(false);

	function zoomIn() {
		if (menu.channels.zoomed._isBannerShown) return;
		menu.channels.zoomed._isBannerShown = true;
		menu.channels.storage.updateOrdered();
		menu.music.fadeOut();

		setTimeout(() => {
			zoom = true;
			SimpleSound.play(SOUNDS.CHANNEL.zoomIn);
		}, 100);

		setTimeout(() => {
			menu.channels.zoomed._isFullyFocused = true;
		}, 750);
	}

	function zoomOut() {
		if (!menu.channels.zoomed._isBannerShown) return;
		zoom = false;
		menu.channels.zoomed._isFullyFocused = false;
		SimpleSound.play(SOUNDS.CHANNEL.zoomOut);
		menu.music.fadeIn(3);

		setTimeout(() => {
			menu.channels.zoomed._isBannerShown = false;
		}, 500);
	}

	const changeChannel = throttle((direction: 'left' | 'right') => {
		menu.channels.zoomed.set(
			menu.channels.storage.getNext(menu.channels.zoomed.channel!, direction)
		);
		SimpleSound.play(SOUNDS.CHANNEL.scroll_page);
	}, PAGE_SCROLL_DELAY);

	$effect(() => {
		const func = menu.channels.zoomed.isSelected ? zoomIn : zoomOut;
		untrack(func);
	});
</script>

{#if menu.channels.zoomed._isBannerShown}
	<ScrollArrow
		position={'left'}
		show={menu.channels.zoomed.fullyFocused}
		onclick={() => changeChannel('left')}
	/>
	<ScrollArrow
		position={'right'}
		show={menu.channels.zoomed.fullyFocused}
		onclick={() => changeChannel('right')}
	/>
	<div class="banner-wrapper" class:zoom>
		<div
			class="content"
			style:transform-origin={menu.channels.zoomed.transformOrigin()}
			class:interactable={menu.channels.zoomed.fullyFocused}
		>
			<div class="banner">
				<div class="sandbox">
					{#if menu.channels.zoomed.channel}
						<menu.channels.zoomed.channel.banner />
					{/if}
				</div>
			</div>
			<div class="options">
				<Button clickSound={SOUNDS.BUTTON.click2} onclick={menu.channels.zoomed.unset}
					>Wii Menu</Button
				>
				<Button>Start</Button>
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

		$duration-in: 0.4s;
		$duration-out: 0.6s;
		$tfunction-in: cubic-bezier(0.55, 0.055, 0.675, 0.19);
		$tfunction-out: cubic-bezier(0.215, 0.61, 0.355, 1);

		&,
		.content {
			transition:
				scale $duration-out $tfunction-out,
				translate $duration-out $tfunction-out,
				padding $duration-out $tfunction-out,
				opacity $duration-out,
				background $duration-out;
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
				$gradient: radial-gradient(40vw at 50% -75%, rgba(255, 255, 255, 1), transparent);
				position: relative;
				display: grid;
				grid-template-columns: 0.5fr 1fr 1fr 0.5fr;
				gap: 3em;
				padding: 2.5em;
				padding-top: 0.75em;
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
					); // 52 seems to work fine at the edge of the bottom
					background: $gradient, #cecec4;
					border-top-left-radius: 50%;
					border-top-right-radius: 50%;
					box-shadow: 0 -#{$border} 0 0 black;
				}

				:global(button) {
					&:first-of-type {
						grid-column: 2;
					}

					&:last-of-type {
						grid-column: 3;
					}
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
					scale $duration-in $tfunction-in,
					translate $duration-in $tfunction-in,
					padding $duration-in $tfunction-in,
					opacity $duration-in,
					background $duration-in;
			}
		}
	}
</style>
