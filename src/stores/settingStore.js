import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'dark',
      defaultProvider: 'OpenRouter',
      apiKeys: {
        Ollama: '',
        OpenRouter: '',
        HuggingFace: '',
        Gemini: '',
      },
      selectedModels: {
        Ollama: 'gemma4:cloud',
        OpenRouter: 'openrouter/auto',
        HuggingFace: 'gpt2',
        Gemini: 'gemini-pro',
      },

      setTheme: (theme) => set({ theme }),
      setDefaultProvider: (provider) => set({ defaultProvider: provider }),
      setApiKey: (provider, key) => set((state) => ({
        apiKeys: { ...state.apiKeys, [provider]: key },
      })),
      setSelectedModel: (provider, model) => set((state) => ({
        selectedModels: { ...state.selectedModels, [provider]: model },
      })),
    }),
    {
      name: 'chorus-settings',
      version: 1,
    }
  )
);

export default useSettingsStore;
