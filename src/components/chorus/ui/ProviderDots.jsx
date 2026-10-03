export function ProviderDots() {
  const health = { Ollama: true, OpenRouter: false, HuggingFace: false, Gemini: false };

  return (
    <div className="flex gap-1.5">
      {Object.entries(health).map(([provider, ok]) => (
        <div
          key={provider}
          title={provider}
          className={`w-2.5 h-2.5 rounded-full ${ok ? 'bg-[#51cf66] shadow-[0_0_6px_#51cf66]' : 'bg-[#555]'}`}
        />
      ))}
    </div>
  );
}