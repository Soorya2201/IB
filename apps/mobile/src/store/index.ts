import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartSlice, createCartSlice } from './cartSlice';
import { ChatSlice, createChatSlice } from './chatSlice';
import { ProfileSlice, createProfileSlice } from './profileSlice';
import { OrderHistorySlice, createOrderHistorySlice } from './orderHistorySlice';

type StoreState = CartSlice & ChatSlice & ProfileSlice & OrderHistorySlice;

export const useStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createCartSlice(...args),
      ...createChatSlice(...args),
      ...createProfileSlice(...args),
      ...createOrderHistorySlice(...args),
    }),
    {
      name: 'bistro-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist cart + profile — chat messages reset each session
      partialize: (state) => ({
        items:        state.items,
        restrictions: state.restrictions,
        likedItems:   state.likedItems,
      }),
    }
  )
);
