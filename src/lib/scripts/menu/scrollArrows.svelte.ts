type DefinitionPair<T> =
	| {
			left: () => T;
			right: () => T;
	  }
	| (() => T);

interface ScrollArrowDefinition {
	showPredicates: DefinitionPair<boolean>;
	keydownPredicates: DefinitionPair<boolean>;
	onClick: DefinitionPair<void>;
}

export type ArrowPosition = 'left' | 'right';

export class ScrollArrowManager {
	private current: ScrollArrowDefinition | undefined = $state(undefined);

	public set = (def: ScrollArrowDefinition) => {
		this.current = def;
	};

	public shouldShow(side: ArrowPosition): boolean {
		return this.getSideProperty(side, 'showPredicates') ?? false;
	}

	public get def() {
		return this.current;
	}

	private getSideProperty<K extends keyof ScrollArrowDefinition>(side: ArrowPosition, prop: K) {
		if (this.current === undefined) return undefined;
		const value = this.current[prop];

		if ('right' in value && 'left' in value) {
			return value[side];
		}

		return value;
	}
}
