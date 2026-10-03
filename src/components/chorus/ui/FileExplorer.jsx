import { Folder, FileText, ChevronRight } from 'lucide-react';

const FILE_TREE = [
  { name: 'bliss26-subkernel', type: 'folder', children: [
    { name: 'src-tauri', type: 'folder' },
    { name: 'ui', type: 'folder' },
  ]},
  { name: 'Chorus Engine v0.1.0-RC', type: 'folder', children: [
    { name: 'compiler', type: 'folder' },
    { name: 'harness', type: 'folder' },
  ]},
  { name: 'Chorus-agent', type: 'folder', children: [
    { name: 'src', type: 'folder' },
    { name: 'public', type: 'folder' },
  ]},
  { name: 'logs', type: 'folder' },
  { name: 'nul', type: 'file' },
];

export function FileExplorer() {
  return (
    <div className="w-56 bg-[#0d0d14] border-l border-[#2a2a4a] flex flex-col flex-shrink-0">
      <div className="px-3 py-2 text-[10px] text-[#8888aa] uppercase tracking-wider border-b border-[#2a2a4a]">
        DEV
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {FILE_TREE.map((item, i) => (
          <div key={i} className="px-3 py-1.5 text-xs text-[#e0e0f0] hover:bg-[#1a1a2e] cursor-pointer flex items-center gap-2">
            {item.type === 'folder' ? (
              <Folder size={12} className="text-[#00d4ff]" />
            ) : (
              <FileText size={12} className="text-[#8888aa]" />
            )}
            <span className="truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}