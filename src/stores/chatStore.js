import { create } from 'zustand';

const useChatStore = create((set) => ({
  messages: [],
  isGenerating: false,
  currentProvider: 'OpenRouter',
  currentModel: 'openrouter/auto',
  inferenceMethod: 'chat',
  abortController: null,

  addMessage: (role, content, meta = {}) => set((state) => ({
    messages: [...state.messages, {
      role,
      content,
      id: meta.id || `msg_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      timestamp: Date.now(),
      meta,
    }],
  })),

  setGenerating: (val) => set({ isGenerating: val }),
  setProvider: (provider) => set({ currentProvider: provider }),
  setModel: (model) => set({ currentModel: model }),
  setInferenceMethod: (method) => set({ inferenceMethod: method }),
  setAbortController: (ac) => set({ abortController: ac }),
  clearMessages: () => set({ messages: [] }),
}));

export default useChatStore;
