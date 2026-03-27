const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

class Time {
	private _date = $state(new Date());
	private updateInterval: number = -1;

	constructor() {
		this.updateInterval = setInterval(this.update, 5000);
	}

	private update = () => {
		this._date = new Date();
	};

	public detach = () => {
		clearInterval(this.updateInterval);
	};

	public get timeFormatted() {
		return [this._date.getHours().toString(), this._date.getMinutes().toString().padStart(2, '0')];
	}

	public get dateFormatted() {
		return `${this.dayFormatted.slice(0, 3)}. ${this._date.getDate().toString().padStart(2, '0')}-${(this._date.getMonth() + 1).toString().padStart(2, '0')}`;
	}

	public get dayFormatted() {
		return DAYS[this._date.getDay() - 1];
	}

	public get date() {
		return this._date;
	}
}

export const time = new Time();
