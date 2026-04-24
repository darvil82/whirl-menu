import { Menu } from '$lib/scripts/menu/menu';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
	Menu.initialize();
};
