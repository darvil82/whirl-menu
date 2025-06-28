<div class="disc-channel">
	<div class="disc"></div>
</div>

<style lang="scss">
	.disc-channel {
		position: absolute;
		inset: 0;
		background: linear-gradient(white 50%, rgb(248, 248, 248) 50%);
		display: grid;
		place-content: center;
	}

	.disc {
		position: relative;
		height: 14.5vh;
		translate: 0 -0.4vh;
		width: 14.5vh;
		$base: rgb(190, 190, 190);
		$shine: rgb(230, 230, 230);
		animation: disc-rotate 7s linear infinite;

		@keyframes disc-rotate {
			0% {
				transform: rotateY(0deg);
				filter: brightness(1);
			}
			12.5% {
				transform: rotateY(90deg);
				filter: brightness(0.85);
			}
			15% {
				filter: brightness(1.12);
			}
			30% {
				transform: rotateY(0deg);
				filter: brightness(1);
			}
		}

		&::after {
			content: '';
			position: absolute;
			inset: 0;

			mask: radial-gradient(
				transparent 7%,
				white 7% 12%,
				transparent 12% 17%,
				white 17% 20%,
				transparent 20% 22.5%,
				white 22.5% 65%,
				transparent 65% 68%,
				white 68% 71%,
				transparent 71%
			);
			background:
				radial-gradient(transparent 67%, $base 67%),
				conic-gradient(
					$shine,
					$base 45deg 50deg,
					$shine 80deg,
					$base 100deg,
					$shine 130deg,
					$shine 170deg,
					$base 170deg,
					$shine 190deg,
					$shine 210deg,
					$base 240deg 270deg,
					$shine 270deg 290deg,
					$base 310deg,
					$shine 360deg
				);
			filter: blur(6px);
		}

		&::before {
			position: absolute;
			top: 105%;
			inset-inline: 0;
			content: '';
			height: inherit;
			background: $shine;
			border: 0.25em solid $base;
			border-radius: 50%;
			opacity: 0.25;
		}
	}
</style>
