import { create } from 'zustand';

export type Language = 'ko' | 'en';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  language: 'ko',
  setLanguage: (language) => set({ language }),
}));