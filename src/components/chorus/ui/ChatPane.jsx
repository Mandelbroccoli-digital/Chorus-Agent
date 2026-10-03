import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Plus } from 'lucide-react';
import useSettingsStore from '../../../stores/settingsStore.js';

export function ChatPane({ messages, onSend, generating, providers, currentProvider, currentModel, onProviderSwitch }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const { theme } = useSettingsStore();

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  const headerBgClass = theme === 'light' ? 'bg-gray-50' : 'bg-[#12121a]';
  const borderClass = theme === 'light' ? 'border-gray-200' : 'border-[#2a2a4a]';
  const inputBgClass = theme === 'light'
    ? 'bg-gray-100 border-gray-300 text-gray-900 focus:border-blue-400'
    : 'bg-[#1a1a2e] border-[#2a2a4a] text-[#e0e0f0] focus:border-[#00d4ff]';
  const buttonActiveClass = theme === 'light'
    ? 'bg-blue-500 border-blue-600 text-white'
    : 'bg-[#0088aa] border-[#00d4ff] text-white';
  const buttonInactiveClass = theme === 'light'
    ? 'border-gray-300 text-gray-600 hover:border-gray-400'
    : 'border-[#2a2a4a] text-[#8888aa] hover:border-[#00d4ff]';
  const userMsgClass = theme === 'light' ? 'bg-blue-500 text-white' : 'bg-[#0088aa] text-white';
  const assistantMsgClass = theme === 'light' ? 'bg-gray-100 border-gray-300 text-gray-900' : 'bg-[#16162a] border-[#2a2a4a] text-[#e0e0f0]';

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat header */}
      <div className={`flex items-center justify-between px-4 py-2 ${headerBgClass} border-b ${borderClass}`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium truncate max-w-[400px] ${theme === 'light' ? 'text-gray-900' : 'text-[#e0e0f0]'}`}>
            {currentModel || 'Model'}
          </span>
          <button className={`transition-colors ${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-[#8888aa] hover:text-[#00d4ff]'}`}>
            <Plus size={14} />
          </button>
        </div>
        <div className="flex gap-1">
          {providers.map((p) => (
            <button
              key={p}
              onClick={() => onProviderSwitch(p)}
              className={`px-2 py-1 text-[10px] rounded border transition-all ${
                currentProvider === p ? buttonActiveClass : buttonInactiveClass
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${theme === 'light' ? 'bg-white' : 'bg-[#0a0a0f]'}`}>
        {messages.length === 0 && (
          <div className={`text-center text-sm mt-12 ${theme === 'light' ? 'text-gray-400' : 'text-[#8888aa]'}`}>
            The soil is tilled. The network is listening. Speak to the chorus.
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            <div className={`max-w-[80%] rounded-lg p-3 text-sm border ${
              msg.role === 'user' ? `${userMsgClass} border-transparent` : `${assistantMsgClass} border`
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className={`text-[10px] mt-1 opacity-50 ${theme === 'light' ? 'text-gray-600' : 'text-[#8888aa]'}`}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {generating && (
          <div className="flex gap-3">
            <div className={`rounded-lg p-3 text-sm italic ${theme === 'light' ? 'bg-gray-100 border border-gray-300 text-blue-500' : 'bg-[#16162a] border border-[#2a2a4a] text-[#00d4ff]'}`}>
              Processing...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className={`p-3 ${headerBgClass} border-t ${borderClass} flex gap-2`}>
        <button className={`p-2 transition-colors ${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-[#8888aa] hover:text-[#e0e0f0]'}`}>
          <Paperclip size={16} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Speak to the chorus..."
          className={`flex-1 px-3 py-2 rounded-lg text-sm outline-none border transition-colors ${inputBgClass}`}
          disabled={generating}
        />
        <button
          type="submit"
          disabled={generating || !input.trim()}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ${theme === 'light' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-[#0088aa] hover:bg-[#00d4ff] text-white'}`}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
