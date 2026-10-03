import { useState, useEffect, useCallback } from 'react';
import chatStore from './stores/chatStore.js';
import sessionStore from './stores/sessionStore.js';
import telemetryStore from './stores/telemetryStore.js';
import computerUseStore from './stores/computerUseStore.js';

const useChatStore = chatStore;
const useSessionStore = sessionStore;
const useTelemetryStore = telemetryStore;
const useComputerUseStore = computerUseStore;
import { SubkernelBridge, PROTOCOL_STATES } from './lib/subkernel-bridge.js';
import { OllamaGateway } from './lib/ollama-gateway.js';
import { Sidebar } from './components/chorus/ui/Sidebar.jsx';
import { SessionsPane } from './components/chorus/ui/SessionsPane.jsx';
import { ChatPane } from './components/chorus/ui/ChatPane.jsx';
import { TerminalLog } from './components/chorus/ui/TerminalLog.jsx';
import { FileExplorer } from './components/chorus/ui/FileExplorer.jsx';
import { ProviderDots } from './components/chorus/ui/ProviderDots.jsx';

export function App() {
  const [bridge] = useState(() => new SubkernelBridge());
  const [ollama] = useState(() => new OllamaGateway());

  const {
    messages, addMessage, isGenerating, setGenerating,
    currentProvider, setProvider, inferenceMethod, setInferenceMethod,
    setAbortController,
  } = useChatStore();

  const { sessions, activeSessionId, addSession, setActiveSession } = useSessionStore();
  const { log, setHealth } = useTelemetryStore();
  const { connected: cuConnected, enqueue: cuEnqueue } = useComputerUseStore();

  // Health check
  const checkHealth = useCallback(async () => {
    const health = {};
    for (const p of ['Ollama', 'OpenRouter', 'HuggingFace', 'Gemini']) {
      health[p] = await ollama.ping(p);
    }
    setHealth(health);
    log('health_check', health);
  }, [ollama, setHealth, log]);

  useEffect(() => {
    checkHealth();
    const iv = setInterval(checkHealth, 30000);
    return () => clearInterval(iv);
  }, [checkHealth]);

  // Connect to HIVE gateway
  useEffect(() => {
    bridge.connect('127.0.0.1', 8788).then(() => {
      addMessage('system', 'HIVE gateway connected on :8788');
      log('gateway', { status: 'connected', port: 8788 });
    }).catch(() => {
      addMessage('system', 'HIVE gateway pending — proxy not yet running');
      log('gateway', { status: 'pending' });
    });
    return () => bridge.disconnect();
  }, [bridge, addMessage, log]);

  const handleSend = useCallback(async (text) => {
    if (!text || isGenerating) return;

    addMessage('user', text);
    log('user_message', { provider: currentProvider, method: inferenceMethod });

    setGenerating(true);
    const ac = new AbortController();
    setAbortController(ac);

    try {
      const response = await ollama.generate(text, currentProvider);
      addMessage('assistant', response);
      log('assistant_response', { provider: currentProvider, length: response.length });
    } catch (e) {
      addMessage('assistant', `Error: ${e.message}`);
      log('error', { error: e.message });
    } finally {
      setGenerating(false);
      setAbortController(null);
    }
  }, [isGenerating, currentProvider, inferenceMethod, addMessage, log, ollama, setGenerating, setAbortController]);

  const handleProviderSwitch = useCallback((provider) => {
    setProvider(provider);
    log('model_switch', { provider });
  }, [setProvider, log]);

  const handleInferenceSwitch = useCallback((method) => {
    setInferenceMethod(method);
    log('inference_switch', { method });
  }, [setInferenceMethod, log]);

  return (
    <div className="flex h-screen bg-[#0a0a0f] text-[#e0e0f0] font-mono overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Middle Pane – Sessions */}
      <SessionsPane />

      {/* Right Pane – Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-2 bg-[#12121a] border-b border-[#2a2a4a]">
          <div className="flex items-center gap-2">
            <span className="text-[#00d4ff] font-bold text-sm">Chorus Agent</span>
            <ProviderDots />
          </div>
          <div className="flex gap-1">
            {['chat', 'completion', 'embed'].map((m) => (
              <button
                key={m}
                onClick={() => handleInferenceSwitch(m)}
                className={`px-2 py-1 text-[10px] rounded border border-[#2a2a4a] transition-all ${
                  inferenceMethod === m
                    ? 'bg-[#0088aa] border-[#00d4ff] text-white'
                    : 'text-[#8888aa] hover:border-[#00d4ff]'
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <ChatPane
          messages={messages}
          onSend={handleSend}
          generating={isGenerating}
          providers={['Ollama', 'OpenRouter', 'HuggingFace', 'Gemini']}
          currentProvider={currentProvider}
          onProviderSwitch={handleProviderSwitch}
        />

        <TerminalLog />
      </div>

      {/* Far Right – DEV Explorer */}
      <FileExplorer />
    </div>
  );
}

export default App;