/**
 * Chorus Agent – Project Scaffold
 * Rebuilt from the Hermes desktop layout (three-column: sidebar | sessions | chat)
 * with computer-use bridge for agent control from the Owl side.
 *
 * Architecture:
 *   - Zustand stores: chat, sessions, telemetry, computer-use
 *   - HIVE TCP gateway WebSocket bridge (127.0.0.1:8788)
 *   - Subkernel protocol: JSON frames {id, channel, opcode, value}
 *   - Provider switching: Ollama / OpenRouter / HuggingFace / Gemini
 *   - Inference modes: chat / completion / embed
 *
 * Layout (mirrors Hermes desktop):
 *   Left sidebar  → nav icons + header + input
 *   Middle pane   → sessions/history tabs
 *   Right pane    → chat + tool output + terminal log
 *   Far right     → DEV file explorer
 */

// Re-export stores
export { useChatStore } from './stores/chatStore.js';
export { useSessionStore } from './stores/sessionStore.js';
export { useTelemetryStore } from './stores/telemetryStore.js';
export { useComputerUseStore } from './stores/computerUseStore.js';

// Re-export protocol
export { SubkernelBridge } from './lib/subkernel-bridge.js';
export { PROTOCOL_STATES } from './lib/protocol-states.js';

// Re-export UI
export { App } from './App.jsx';