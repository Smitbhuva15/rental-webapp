import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      savedProperties: [],
      setUser: (user) => {
        set({ user });
        if (user && user.savedProperties) {
          set({ savedProperties: user.savedProperties });
        }
      },
      logout: () => set({ user: null, savedProperties: [] }),
      setSavedProperties: (savedProperties) => set({ savedProperties }),
      toggleSaveProperty: (propertyId) => {
        const currentSaved = get().savedProperties;
        if (currentSaved.includes(propertyId)) {
          set({ savedProperties: currentSaved.filter(id => id !== propertyId) });
        } else {
          set({ savedProperties: [...currentSaved, propertyId] });
        }
      },
    }),
    {
      name: 'renthub-storage', // key in local storage
    }
  )
);
