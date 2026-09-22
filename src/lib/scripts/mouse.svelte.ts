import { debounce } from './utils.svelte';

const VEL_SMOOTHING = 0.15;
const VEL_DECAY = 0.15;
const VEL_STOP_DELAY = 150;

class Mouse {
	private pos: [number, number] | undefined = $state();
	private vel: [number, number] = $state([0, 0]);
	private lastPosCheck: number | undefined;
	private inView = $state(true);
	_isDragging = $state(false);
	private stoppedMoving = false;

	public constructor() {
		document.addEventListener('mousemove', this.onMove);
		document.addEventListener('mouseleave', this.onHide);
		document.addEventListener('mouseenter', this.onShow);
	}

	public detach() {
		document.removeEventListener('mousemove', this.onMove);
		document.removeEventListener('mouseleave', this.onHide);
		document.removeEventListener('mouseenter', this.onShow);
	}

	private onHide = () => {
		this.inView = false;
	};

	private onShow = () => {
		this.inView = true;
	};

	private onMove = (e: MouseEvent) => {
		const newPos: typeof this.pos = [e.x, e.y];
		this.stoppedMoving = false;

		const now = Date.now();

		if (this.pos) {
			const dx = newPos[0] - this.pos[0];
			const dy = newPos[1] - this.pos[1];

			if (this.lastPosCheck) {
				const diff = Math.max(4, now - this.lastPosCheck);

				const targetVel: [number, number] = [dx / diff, dy / diff];

				this.vel = [
					this.vel[0] + (targetVel[0] - this.vel[0]) * VEL_SMOOTHING,
					this.vel[1] + (targetVel[1] - this.vel[1]) * VEL_SMOOTHING
				];
			}
		}

		this.pos = newPos;
		this.lastPosCheck = now;

		// Schedule the smooth stop
		this.scheduleSmoothStop();
	};

	private scheduleSmoothStop = debounce(() => {
		this.stoppedMoving = true;
		this.smoothStop();
	}, VEL_STOP_DELAY);

	private smoothStop = () => {
		if (!this.stoppedMoving) return; // movement resumed

		// decay
		this.vel = [this.vel[0] * (1 - VEL_DECAY), this.vel[1] * (1 - VEL_DECAY)];

		// Stop completely when very close
		if (Math.abs(this.vel[0]) < 0.001 && Math.abs(this.vel[1]) < 0.001) {
			this.vel = [0, 0];
			return;
		}

		requestAnimationFrame(this.smoothStop);
	};

	get position() {
		return this.pos ?? [0, 0];
	}

	get velocity() {
		return this.vel ?? [0, 0];
	}

	get isVisible() {
		return this.pos !== undefined && this.inView;
	}

	get dragging() {
		return this._isDragging;
	}
}

export const mouse = new Mouse();
