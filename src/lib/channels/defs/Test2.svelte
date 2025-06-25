<div class="c">
	<h2>TEST</h2>
</div>

<style lang="scss">
	.c {
		font-size: 5em;
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		background: linear-gradient(135deg, #6593f6 0%, #ff683e 100%);

		h2 {
			animation: dance 3s infinite;

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
