import { MessageCircle, Plus, GitBranch, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-12 bg-[#12121a] border-r border-[#2a2a4a] flex flex-col items-center py-3 gap-4 flex-shrink-0">
      <div className="w-8 h-8 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center text-[#00d4ff] text-sm font-bold">
        C
      </div>
      <button className="w-8 h-8 rounded hover:bg-[#1a1a2e] flex items-center justify-center text-[#8888aa] hover:text-[#e0e0f0] transition-colors" title="New Chat">
        <Plus size={16} />
      </button>
      <button className="w-8 h-8 rounded hover:bg-[#1a1a2e] flex items-center justify-center text-[#8888aa] hover:text-[#e0e0f0] transition-colors" title="Sessions">
        <MessageCircle size={16} />
      </button>
      <button className="w-8 h-8 rounded hover:bg-[#1a1a2e] flex items-center justify-center text-[#8888aa] hover:text-[#e0e0f0] transition-colors" title="Branches">
        <GitBranch size={16} />
      </button>
      <div className="flex-1" />
      <button className="w-8 h-8 rounded hover:bg-[#1a1a2e] flex items-center justify-center text-[#8888aa] hover:text-[#e0e0f0] transition-colors" title="Settings">
        <Settings size={16} />
      </button>
    </div>
  );
}