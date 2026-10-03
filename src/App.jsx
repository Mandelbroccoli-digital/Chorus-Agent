import { useState, useEffect, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import chatStore from './stores/chatStore.js';
import sessionStore from './stores/sessionStore.js';
import telemetryStore from './stores/telemetryStore.js';
import computerUseStore from './stores/computerUseStore.js';
import useSettingsStore from './stores/settingsStore.js';

const useChatStore = chatStore;
const useSessionStore = sessionStore;
const useTelemetryStore = telemetryStore;
const useComputerUseStore = computerUseStore;

import { SubkernelBridge } from './lib/subkernel-bridge.js';
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
  const { theme, setTheme, defaultProvider, selectedModels, apiKeys } = useSettingsStore();

  const {
    messages,
    addMessage,
    isGenerating,
    setGenerating,
    currentProvider,
    setProvider,
    currentModel,
    setModel,
    inferenceMethod,
    setInferenceMethod,
    setAbortController,
  } = useChatStore();

  const { log, setHealth } = useTelemetryStore();
  const { connected: cuConnected, enqueue: cuEnqueue } = useComputerUseStore();

  useEffect(() => {
    if (currentProvider !== defaultProvider) {
      setProvider(defaultProvider);
    }
    if (!currentModel || currentModel === '') {
      setModel(selectedModels[defaultProvider] || 'openrouter/auto');
    }
  }, [currentProvider, defaultProvider, currentModel, selectedModels, setProvider, setModel]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
      root.style.colorScheme = 'light';
    } else {
      root.classList.remove('light-theme');
      root.style.colorScheme = 'dark';
    }
  }, [theme]);

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

  useEffect(() => {
    const hiveHost = import.meta.env.VITE_HIVE_HOST || '127.0.0.1';
    const hivePort = Number(import.meta.env.VITE_HIVE_PORT || 8788);

    bridge.connect(hiveHost, hivePort).then(() => {
      addMessage('system', `HIVE gateway connected on ${hiveHost}:${hivePort}`);
      log('gateway', { status: 'connected', host: hiveHost, port: hivePort });
    }).catch(() => {
      addMessage('system', `HIVE gateway pending — ${hiveHost}:${hivePort} not reachable`);
      log('gateway', { status: 'pending', host: hiveHost, port: hivePort });
    });

    return () => bridge.disconnect();
  }, [bridge, addMessage, log]);

  const handleSend = useCallback(async (text) => {
    if (!text || isGenerating) return;

    addMessage('user', text);
    log('user_message', { provider: currentProvider, model: currentModel, method: inferenceMethod });

    setGenerating(true);
    setAbortController(new AbortController());

    try {
      const model = selectedModels[currentProvider] || currentModel;
      const response = await ollama.generate(
        text,
        currentProvider,
        model,
        apiKeys[currentProvider]
      );
      addMessage('assistant', response);
      log('assistant_response', { provider: currentProvider, model, length: response.length });
    } catch (e) {
      addMessage('assistant', `Error: ${e.message}`);
      log('error', { error: e.message });
    } finally {
      setGenerating(false);
      setAbortController(null);
    }
  }, [
    isGenerating,
    currentProvider,
    currentModel,
    inferenceMethod,
    addMessage,
    log,
    ollama,
    setGenerating,
    setAbortController,
    selectedModels,
    apiKeys,
  ]);

  const handleProviderSwitch = useCallback((provider) => {
    const model = selectedModels[provider] || currentModel;
    setProvider(provider);
    setModel(model);
    log('model_switch', { provider, model });
  }, [currentModel, selectedModels, setProvider, setModel, log]);

  const handleInferenceSwitch = useCallback((method) => {
    setInferenceMethod(method);
    log('inference_switch', { method });
  }, [setInferenceMethod, log]);

  const themeButtonClasses =
    theme === 'light'
      ? 'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200'
      : 'bg-[#12121a] text-[#e0e0f0] border-[#2a2a4a] hover:text-[#00d4ff]';

  return (
    <div className={`flex h-screen font-mono overflow-hidden ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-[#0a0a0f] text-[#e0e0f0]'}`}>
      <Sidebar />

      <SessionsPane />

      <div className="flex-1 flex flex-col min-w-0">
        <div className={`flex items-center justify-between px-4 py-2 border-b ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-[#12121a] border-[#2a2a4a]'}`}>
          <div className="flex items-center gap-2">
            <span className={`font-bold text-sm ${theme === 'light' ? 'text-blue-600' : 'text-[#00d4ff]'}`}>
              Chorus Agent
            </span>
            <ProviderDots />
          </div>

          <div className="flex items-center gap-2">
            {['chat', 'completion', 'embed'].map((m) => (
              <button
                key={m}
                onClick={() => handleInferenceSwitch(m)}
                className={`px-2 py-1 text-[10px] rounded border transition-all ${
                  inferenceMethod === m
                    ? theme === 'light'
                      ? 'bg-blue-500 border-blue-600 text-white'
                      : 'bg-[#0088aa] border-[#00d4ff] text-white'
                    : theme === 'light'
                      ? 'border-gray-300 text-gray-600 hover:border-gray-400'
                      : 'text-[#8888aa] border-[#2a2a4a] hover:border-[#00d4ff]'
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}

            <button
              type="button"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`ml-2 inline-flex items-center justify-center w-8 h-8 rounded border ${themeButtonClasses}`}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>

        <ChatPane
          messages={messages}
          onSend={handleSend}
          generating={isGenerating}
          providers={['Ollama', 'OpenRouter', 'HuggingFace', 'Gemini']}
          currentProvider={currentProvider}
          currentModel={currentModel}
          onProviderSwitch={handleProviderSwitch}
        />

        <TerminalLog />
      </div>

      <FileExplorer />
    </div>
  );
}

export default App;
