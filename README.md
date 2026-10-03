# Chorus Agent – Rebuilt Project

## Architecture
- **Layout**: Three-column (sidebar | sessions | chat) + far-right DEV explorer
- **Theme**: Dark, high-density, Eleusinian aesthetic — mirrors Hermes desktop
- **Bridge**: HIVE TCP gateway WebSocket (127.0.0.1:8788)
- **Providers**: Ollama / OpenRouter / HuggingFace / Gemini
- **Inference modes**: chat / completion / embed
- **Computer-use**: `src/lib/computer-use-bridge.js` — click, type, screenshot, eval, navigate

## Quick Start
```bash
npm run dev      # :5174
npm run build    # production
```

## File Tree
```
src/
  App.jsx              # Main layout: Sidebar | SessionsPane | ChatPane | TerminalLog | FileExplorer
  main.jsx             # Entry point
  index.css            # Tailwind + scrollbar styles
  index.js             # Re-exports
  stores/
    chatStore.js       # Messages, provider, inference mode
    sessionStore.js    # Sessions, pinning, history
    telemetryStore.js  # Events, health checks
    computerUseStore.js # Computer-use action queue
  components/chorus/ui/
    Sidebar.jsx        # Nav icons (C, +, branch, settings)
    SessionsPane.jsx   # Tabs, pinned, history tree
    ChatPane.jsx       # Message list + input + provider buttons
    ProviderDots.jsx   # Health indicator dots
    TerminalLog.jsx    # Throughput / status bar
    FileExplorer.jsx   # DEV tree
  lib/
    subkernel-bridge.js   # WebSocket protocol frame handler
    ollama-gateway.js     # Provider abstraction
    computer-use-bridge.js # Click/type/screenshot/eval/navigate
```