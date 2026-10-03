/**
 * Computer-Use Bridge – enables the Owl agent to control the Chorus Agent
 * via WebSocket commands to the HIVE gateway.
 *
 * Commands:
 *   - click(x, y)          – click at viewport coordinates
 *   - type(text)           – insert text into focused element
 *   - screenshot()         – capture current viewport
 *   - navigate(url)        – navigate to URL
 *   - eval(js)             – execute JS in page context
 *   - read_page()          – extract page text content
 */
export class ComputerUseBridge {
  constructor(wsUrl = 'ws://127.0.0.1:8788') {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.connected = false;
    this.handlers = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => {
        this.connected = true;
        resolve();
      };
      this.ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.id && this.handlers.has(msg.id)) {
            const { resolve, reject } = this.handlers.get(msg.id);
            this.handlers.delete(msg.id);
            msg.error ? reject(new Error(msg.error)) : resolve(msg.result);
          }
        } catch {}
      };
      this.ws.onerror = reject;
      this.ws.onclose = () => { this.connected = false; };
    });
  }

  send(opcode, payload = {}) {
    return new Promise((resolve, reject) => {
      if (!this.connected) { reject(new Error('Not connected')); return; }
      const id = `cu_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      this.handlers.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, opcode, ...payload }));
      setTimeout(() => {
        if (this.handlers.has(id)) {
          this.handlers.delete(id);
          reject(new Error('Timeout'));
        }
      }, 10000);
    });
  }

  click(x, y) { return this.send('COMPUTER_CLICK', { x, y }); }
  type(text) { return this.send('COMPUTER_TYPE', { text }); }
  screenshot() { return this.send('COMPUTER_SCREENSHOT'); }
  navigate(url) { return this.send('COMPUTER_NAVIGATE', { url }); }
  eval(js) { return this.send('COMPUTER_EVAL', { code: js }); }
  readPage() { return this.send('COMPUTER_READ'); }

  disconnect() {
    if (this.ws) this.ws.close();
    this.connected = false;
  }
}
