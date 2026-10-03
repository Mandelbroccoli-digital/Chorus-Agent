import { create } from 'zustand';

const useChatStore = create((set, get) => ({
  messages: [],
  isGenerating: false,
  currentProvider: 'Ollama',
  inferenceMethod: 'chat',
  abortController: null,

  addMessage: (role, content, meta = {}) => set((state) => ({
    messages: [...state.messages, {
      role,
      content,
      id: meta.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      meta,
    }],
  })),

  setGenerating: (val) => set({ isGenerating: val }),
  setProvider: (provider) => set({ currentProvider: provider }),
  setInferenceMethod: (method) => set({ inferenceMethod: method }),
  setAbortController: (ac) => set({ abortController: ac }),

  clearMessages: () => set({ messages: [] }),
}));

export default useChatStore;