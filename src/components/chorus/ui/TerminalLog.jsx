export function TerminalLog() {
  const entries = [
    { time: '19:30:01', cmd: '$ chorus kernel ready · awaiting intent', status: 'ok' },
    { time: '19:30:00', cmd: 'rate limited — resets in ~13s, retrying in 13s (attempt 1/3)', status: 'warn' },
  ];

  return (
    <div className="bg-[#0d0d14] border-t border-[#2a2a4a] px-4 py-2 flex items-center gap-3 flex-shrink-0">
      <span className="text-[10px] text-[#8888aa] font-mono">// CHORUS // TOOL THROUGHPUT</span>
      <span className="text-[10px] text-[#00d4ff] font-mono">$ chorus kernel ready · awaiting intent</span>
      <span className="text-[10px] text-[#ffd43b] font-mono">rate limited — resets in ~13s</span>
      <span className="text-[10px] text-[#8888aa] ml-auto">Gateway ready · Dev</span>
    </div>
  );
}