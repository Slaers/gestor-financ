import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: number | null;
  name: string | null;
  // Add other user-specific properties if needed
}

interface UserState {
  user: User | null;
  token: string | null;
  setUserAndToken: (user: User, token: string) => void;
  clearUserAndToken: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUserAndToken: (user, token) => {
        set({ user, token });
        // Persisting token in localStorage is handled by the middleware,
        // but if you need to do it explicitly for other reasons or use it immediately:
        // localStorage.setItem('jwt_token', token);
      },
      clearUserAndToken: () => {
        set({ user: null, token: null });
        // localStorage.removeItem('jwt_token'); // Also handled by middleware if configured for token
      },
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ token: state.token, user: state.user }), // Persist only token and user
    }
  )
);

// Optional: Export a way to access the token outside of React components if needed
// export const getToken = () => useUserStore.getState().token;

export default useUserStore;
