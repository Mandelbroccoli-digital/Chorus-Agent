import { useState } from 'react';
import { Pin, Plus, Clock, FolderOpen } from 'lucide-react';

const SAMPLE_SESSIONS = [
  { id: 's1', title: 'Ok, Owl. I\'m putting you...', pinned: true, updatedAt: Date.now() - 60000 },
  { id: 's2', title: 'Develop agent protocol...', pinned: false, updatedAt: Date.now() - 3600000 },
  { id: 's3', title: 'Refactor vfs.js', pinned: false, updatedAt: Date.now() - 86400000 },
  { id: 's4', title: 'Redo Outmatch lead-gen', pinned: false, updatedAt: Date.now() - 172800000 },
];

export function SessionsPane() {
  const [activeTab, setActiveTab] = useState('SESSIONS');
  const [sessions] = useState(SAMPLE_SESSIONS);

  return (
    <div className="w-72 bg-[#0d0d14] border-r border-[#2a2a4a] flex flex-col flex-shrink-0">
      <div className="flex border-b border-[#2a2a4a]">
        {['SESSIONS', 'BOTS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === tab
                ? 'text-[#00d4ff] border-b-2 border-[#00d4ff]'
                : 'text-[#8888aa] hover:text-[#e0e0f0]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-3 space-y-1">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#8888aa] hover:text-[#e0e0f0] hover:bg-[#1a1a2e] rounded transition-colors">
          <Plus size={12} /> New Session
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#8888aa] hover:text-[#e0e0f0] hover:bg-[#1a1a2e] rounded transition-colors">
          <FolderOpen size={12} /> Capabilities
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#8888aa] hover:text-[#e0e0f0] hover:bg-[#1a1a2e] rounded transition-colors">
          <Clock size={12} /> Messaging
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#8888aa] hover:text-[#e0e0f0] hover:bg-[#1a1a2e] rounded transition-colors">
          <Clock size={12} /> Artifacts
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#8888aa] hover:text-[#e0e0f0] hover:bg-[#1a1a2e] rounded transition-colors">
          <Clock size={12} /> Scheduled Jobs
        </button>
      </div>

      <div className="px-3 py-1 text-[10px] text-[#8888aa] uppercase tracking-wider">Pinned</div>
      {sessions.filter((s) => s.pinned).map((s) => (
        <div key={s.id} className="px-3 py-2 text-xs text-[#e0e0f0] bg-[#1a1a2e] border-l-2 border-[#ff6b6b] mx-2 rounded-r cursor-pointer">
          <div className="flex items-center gap-2">
            <Pin size={10} className="text-[#ff6b6b]" />
            <span className="truncate">{s.title}</span>
          </div>
        </div>
      ))}

      <div className="px-3 py-1 text-[10px] text-[#8888aa] uppercase tracking-wider mt-3">All Sessions</div>
      <div className="flex-1 overflow-y-auto">
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`px-3 py-2 text-xs cursor-pointer hover:bg-[#1a1a2e] transition-colors truncate mx-1 rounded ${
              !s.pinned ? 'text-[#e0e0f0]' : 'text-[#8888aa]'
            }`}
          >
            {s.title}
          </div>
        ))}
      </div>

      <div className="px-3 py-2 text-[10px] text-[#8888aa] border-t border-[#2a2a4a] space-y-1">
        <div>Last Week</div>
        <div className="pl-2">Refactor vfs.js</div>
        <div className="pl-2">Redo Outmatch lead-gen</div>
        <div className="pt-1">September</div>
        <div className="pl-2">Fix Bliss_Cloud-OS</div>
        <div className="pl-2">Hermes Agent...</div>
        <div className="pt-1">August</div>
        <div className="pl-2">Alrighty, We pivot to bpl...</div>
      </div>
    </div>
  );
}