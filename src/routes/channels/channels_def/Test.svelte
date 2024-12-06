<div class="c">
	<h1>Test channel</h1>
</div>

<style lang="scss">
	.c {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);

		h1 {
			animation: dance 3s infinite;
			font-size: 3rem;

			@keyframes dance {
				100% {
					transform: rotate(0deg);
				}
				25% {
					transform: rotate(5deg);
				}
				50% {
					transform: rotate(-5deg);
				}
				75% {
					transform: rotate(5deg);
				}
			}
		}
	}
</style>
