import { Menu } from '#lib/scripts/menu/menu.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	Menu._initialize();
};
