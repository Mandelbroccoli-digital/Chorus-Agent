import { create } from 'zustand';

const useSessionStore = create((set, get) => ({
  sessions: [],
  activeSessionId: null,
  pinned: [],

  addSession: (session) => set((state) => ({
    sessions: [session, ...state.sessions],
    activeSessionId: session.id,
  })),

  setActiveSession: (id) => set({ activeSessionId: id }),

  pinSession: (id) => set((state) => ({
    pinned: state.pinned.includes(id)
      ? state.pinned.filter((pid) => pid !== id)
      : [...state.pinned, id],
  })),

  addMessageToSession: (sessionId, message) => set((state) => ({
    sessions: state.sessions.map((s) =>
      s.id === sessionId
        ? { ...s, messages: [...s.messages, message], updatedAt: Date.now() }
        : s
    ),
  })),
}));

export default useSessionStore;