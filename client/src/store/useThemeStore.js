import { create } from 'zustand';

const useThemeStore = create((set) => ({
  theme: localStorage.getItem('theme') || 'light',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    
    // Apply class to body
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return { theme: newTheme };
  }),
  initTheme: () => set((state) => {
    if (state.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      return { theme: 'dark' };
    } else {
      document.documentElement.classList.remove('dark');
      return { theme: 'light' };
    }
  })
}));

export default useThemeStore;
