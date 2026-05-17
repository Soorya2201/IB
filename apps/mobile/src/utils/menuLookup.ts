import { MenuItem } from '../types';
import { ITEM_IMAGES } from '../constants/itemImages';
import menuData from '../../../api/src/data/menu.json';

export const MENU_LOOKUP: Record<string, MenuItem> = Object.fromEntries(
  menuData.categories.flatMap(c => c.items).map(item => [
    item.id,
    { ...item, image: item.image ?? ITEM_IMAGES[item.id] ?? '🍽️' } as MenuItem,
  ])
);

export function getMenuItem(id: string): MenuItem | undefined {
  return MENU_LOOKUP[id];
}
