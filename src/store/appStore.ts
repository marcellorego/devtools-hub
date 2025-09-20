import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Navigation
  activeTool: string;

  // UI State
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;

  // User Interactions
  copiedText: string | null;
  lastUsedTool: string;

  // Error Handling
  globalError: Error | null;
  isLoading: boolean;

  // Settings
  autoCopy: boolean;
  soundEnabled: boolean;

  // Actions
  setActiveTool: (tool: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setCopiedText: (text: string | null) => void;
  setGlobalError: (error: Error | null) => void;
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
  setAutoCopy: (autoCopy: boolean) => void;
  setSoundEnabled: (soundEnabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      activeTool: 'base64',
      theme: 'dark',
      sidebarCollapsed: false,
      copiedText: null,
      lastUsedTool: 'base64',
      globalError: null,
      isLoading: false,
      autoCopy: true,
      soundEnabled: false,

      // Actions
      setActiveTool: (tool: string) =>
        set({ activeTool: tool, lastUsedTool: tool }),

      setTheme: (theme: 'dark' | 'light') =>
        set({ theme }),

      setCopiedText: (text: string | null) =>
        set({ copiedText: text }),

      setGlobalError: (error: Error | null) =>
        set({ globalError: error }),

      setLoading: (loading: boolean) =>
        set({ isLoading: loading }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setAutoCopy: (autoCopy: boolean) =>
        set({ autoCopy }),

      setSoundEnabled: (soundEnabled: boolean) =>
        set({ soundEnabled }),
    }),
    {
      name: 'devtools-hub-storage',
      partialize: (state) => ({
        theme: state.theme,
        lastUsedTool: state.lastUsedTool,
        autoCopy: state.autoCopy,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);
