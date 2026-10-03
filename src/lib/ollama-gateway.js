/**
 * OllamaGateway – provider abstraction for local/remote model backends
 */
export class OllamaGateway {
  constructor() {
    this.endpoints = {
      Ollama: import.meta.env.VITE_OLLAMA_URL || 'http://127.0.0.1:11434',
      OpenRouter: import.meta.env.VITE_OPENROUTER_URL || 'https://openrouter.ai/api/v1',
      HuggingFace: import.meta.env.VITE_HUGGINGFACE_URL || 'https://api-inference.huggingface.co',
      Gemini: import.meta.env.VITE_GEMINI_URL || 'https://generativelanguage.googleapis.com/v1beta/models',
    };

    this.modelLists = {
      Ollama: [
        'Mali-Logos:2.2B',
        'llama2:7b',
        'llama2:13b',
        'mistral:7b',
        'phi:2.7b',
      ],
      OpenRouter: [
        'openrouter/auto',
        'meta-llama/llama-2-7b-chat',
        'mistralai/mistral-7b-instruct',
        'openai/gpt-3.5-turbo',
        'openai/gpt-4',
        'anthropic/claude-2',
      ],
      HuggingFace: [
        'gpt2',
        'meta-llama/Llama-2-7b-hf',
        'mistralai/Mistral-7B-Instruct-v0.1',
        'EleutherAI/gpt-neo-2.7B',
      ],
      Gemini: [
        'gemini-pro',
        'gemini-pro-vision',
      ],
    };

    this.models = [];
  }

  async ping(provider) {
    try {
      if (provider === 'Ollama') {
        const res = await fetch(`${this.endpoints.Ollama}/api/tags`, {
          signal: AbortSignal.timeout(5000),
        });
        return res.ok;
      }
      return true;
    } catch {
      return false;
    }
  }

  async checkModels(provider = 'Ollama') {
    try {
      if (provider === 'Ollama') {
        const res = await fetch(`${this.endpoints.Ollama}/api/tags`);
        if (res.ok) {
          const data = await res.json();
          this.models = data.models?.map((m) => m.name) || this.modelLists.Ollama;
          return this.models;
        }
      }
      return this.modelLists[provider] || [];
    } catch {
      return this.modelLists[provider] || [];
    }
  }

  getModelList(provider) {
    return this.modelLists[provider] || [];
  }

  async generate(prompt, provider = 'OpenRouter', model = 'openrouter/auto', apiKey) {
    try {
      const effectiveApiKey =
        apiKey ||
        import.meta.env.VITE_OPENROUTER_API_KEY ||
        import.meta.env.VITE_HUGGINGFACE_API_KEY ||
        import.meta.env.VITE_GEMINI_API_KEY ||
        '';

      if (provider === 'Ollama') {
        return this._generateOllama(prompt, model || 'Mali-Logos:2.2B');
      }

      if (provider === 'OpenRouter') {
        return this._generateOpenRouter(prompt, model || 'openrouter/auto', effectiveApiKey);
      }

      if (provider === 'HuggingFace') {
        return this._generateHuggingFace(prompt, model || 'gpt2', effectiveApiKey);
      }

      if (provider === 'Gemini') {
        return this._generateGemini(prompt, model || 'gemini-pro', effectiveApiKey);
      }

      return `Response from ${provider}`;
    } catch (e) {
      throw new Error(`Generation failed (${provider}): ${e.message}`);
    }
  }

  async _generateOllama(prompt, model) {
    const res = await fetch(`${this.endpoints.Ollama}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, stream: false }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.response || 'No response';
  }

  async _generateOpenRouter(prompt, model, apiKey) {
    if (!apiKey) throw new Error('OpenRouter API key not configured');

    const res = await fetch(`${this.endpoints.OpenRouter}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'No response';
  }

  async _generateHuggingFace(prompt, model, apiKey) {
    if (!apiKey) throw new Error('HuggingFace API key not configured');

    const res = await fetch(`${this.endpoints.HuggingFace}/models/${model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data[0]?.generated_text || 'No response';
  }

  async _generateGemini(prompt, model, apiKey) {
    if (!apiKey) throw new Error('Gemini API key not configured');

    const res = await fetch(`${this.endpoints.Gemini}/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
  }
}
