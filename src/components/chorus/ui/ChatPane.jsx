import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Plus } from 'lucide-react';
import { useChatStore } from '../../../stores/chatStore.js';

export function ChatPane({ messages, onSend, generating, providers, currentProvider, onProviderSwitch }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#12121a] border-b border-[#2a2a4a]">
        <div className="flex items-center gap-2">
          <span className="text-[#e0e0f0] text-sm font-medium truncate max-w-[400px]">
            Ok, OWL. I'M PUTTING YOU AN...
          </span>
          <button className="text-[#8888aa] hover:text-[#00d4ff] transition-colors">
            <Plus size={14} />
          </button>
        </div>
        <div className="flex gap-1">
          {providers.map((p) => (
            <button
              key={p}
              onClick={() => onProviderSwitch(p)}
              className={`px-2 py-1 text-[10px] rounded border transition-all ${
                currentProvider === p
                  ? 'bg-[#0088aa] border-[#00d4ff] text-white'
                  : 'border-[#2a2a4a] text-[#8888aa] hover:border-[#00d4ff]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-[#8888aa] text-sm mt-12">
            The soil is tilled. The network is listening. Speak to the chorus.
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
          >
            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
              msg.role === 'user'
                ? 'bg-[#0088aa] text-white'
                : 'bg-[#16162a] border border-[#2a2a4a] text-[#e0e0f0]'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              <div className="text-[10px] mt-1 opacity-50">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {generating && (
          <div className="flex gap-3">
            <div className="bg-[#16162a] border border-[#2a2a4a] rounded-lg p-3 text-sm text-[#00d4ff] italic">
              Processing...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#12121a] border-t border-[#2a2a4a] flex gap-2">
        <button className="p-2 text-[#8888aa] hover:text-[#e0e0f0] transition-colors">
          <Paperclip size={16} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Speak to the chorus..."
          className="flex-1 bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg px-3 py-2 text-sm text-[#e0e0f0] outline-none focus:border-[#00d4ff] transition-colors"
          disabled={generating}
        />
        <button
          type="submit"
          disabled={generating || !input.trim()}
          className="px-4 py-2 bg-[#0088aa] hover:bg-[#00d4ff] disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}