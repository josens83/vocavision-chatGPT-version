import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  subscriptionStatus: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('authToken', token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('authToken');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface LearningState {
  currentWordIndex: number;
  sessionId: string | null;
  wordsStudied: number;
  wordsCorrect: number;
  setSessionId: (id: string) => void;
  incrementWord: (correct: boolean) => void;
  resetSession: () => void;
}

export const useLearningStore = create<LearningState>()((set) => ({
  currentWordIndex: 0,
  sessionId: null,
  wordsStudied: 0,
  wordsCorrect: 0,
  setSessionId: (id) => set({ sessionId: id }),
  incrementWord: (correct) =>
    set((state) => ({
      currentWordIndex: state.currentWordIndex + 1,
      wordsStudied: state.wordsStudied + 1,
      wordsCorrect: correct ? state.wordsCorrect + 1 : state.wordsCorrect,
    })),
  resetSession: () =>
    set({
      currentWordIndex: 0,
      sessionId: null,
      wordsStudied: 0,
      wordsCorrect: 0,
    }),
}));
