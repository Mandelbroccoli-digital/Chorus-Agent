/**
 * OllamaGateway – provider abstraction for local/remote model backends
 */
export class OllamaGateway {
  constructor() {
    this.endpoints = {
      Ollama: 'http://127.0.0.1:11434',
      OpenRouter: 'https://openrouter.ai/api/v1',
      HuggingFace: 'https://api-inference.huggingface.co',
      Gemini: '',
    };
    this.models = [];
  }

  async ping(provider) {
    try {
      if (provider === 'Ollama') {
        const res = await fetch(`${this.endpoints.Ollama}/api/tags`);
        return res.ok;
      }
      return true;
    } catch { return false; }
  }

  async checkModels() {
    try {
      const res = await fetch(`${this.endpoints.Ollama}/api/tags`);
      if (res.ok) {
        const data = await res.json();
        this.models = data.models?.map((m) => m.name) || [];
      }
    } catch {}
  }

  async generate(prompt, provider = 'Ollama', model = 'Mali-Logos:2.2B') {
    try {
      if (provider === 'Ollama') {
        const res = await fetch(`${this.endpoints.Ollama}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, prompt, stream: false }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data.response || 'No response';
      }
      return `Response from ${provider}`;
    } catch (e) { throw new Error(`Generation failed: ${e.message}`); }
  }
}
