import { create } from 'zustand';

const useComputerUseStore = create((set) => ({
  connected: false,
  actionQueue: [],
  lastResult: null,

  enqueue: (action) => set((state) => ({
    actionQueue: [...state.actionQueue, { ...action, id: `cu_${Date.now()}`, status: 'pending' }],
  })),

  setResult: (result) => set({ lastResult: result }),

  markDone: (id) =>
    set((state) => ({
      actionQueue: state.actionQueue.map((a) =>
        a.id === id ? { ...a, status: 'done' } : a
      ),
    })),

  markError: (id, error) =>
    set((state) => ({
      actionQueue: state.actionQueue.map((a) =>
        a.id === id ? { ...a, status: 'error', error } : a
      ),
    })),

  clearQueue: () => set({ actionQueue: [], lastResult: null }),
}));

export default useComputerUseStore;