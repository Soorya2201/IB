import { StateCreator } from 'zustand';
import { MenuItem } from '../types';

export interface ProfileSlice {
  restrictions: string[];
  likedItems: MenuItem[];
  email: string;
  requireConfirmation: boolean;
  addRestriction:    (restriction: string) => void;
  removeRestriction: (restriction: string) => void;
  clearRestrictions: () => void;
  toggleLike: (item: MenuItem) => void;
  isLiked:    (id: string) => boolean;
  setEmail:   (email: string) => void;
  toggleRequireConfirmation: () => void;
}

export const createProfileSlice: StateCreator<ProfileSlice, [], [], ProfileSlice> = (set, get) => ({
  restrictions: [],
  likedItems:   [],
  email:        '',
  requireConfirmation: false,

  addRestriction: (restriction) => set((state) => ({
    restrictions: state.restrictions.includes(restriction)
      ? state.restrictions
      : [...state.restrictions, restriction],
  })),
  removeRestriction: (restriction) => set((state) => ({
    restrictions: state.restrictions.filter(r => r !== restriction),
  })),
  clearRestrictions: () => set({ restrictions: [] }),

  toggleLike: (item) => set((state) => {
    const already = state.likedItems.some(i => i.id === item.id);
    return {
      likedItems: already
        ? state.likedItems.filter(i => i.id !== item.id)
        : [...state.likedItems, item],
    };
  }),

  isLiked:  (id) => get().likedItems.some(i => i.id === id),
  setEmail: (email) => set({ email }),
  toggleRequireConfirmation: () => set(s => ({ requireConfirmation: !s.requireConfirmation })),
});
