import { create } from 'zustand';

const useTelemetryStore = create((set) => ({
  events: [],
  health: { Ollama: false, OpenRouter: false, HuggingFace: false, Gemini: false },

  log: (type, data) =>
    set((state) => ({
      events: [...state.events.slice(-499), { type, data, ts: Date.now() }],
    })),

  setHealth: (health) => set({ health }),

  getRecent: (n = 50) => get().events.slice(-n),
}));

export default useTelemetryStore;