/**
 * SubkernelBridge – WebSocket client for HIVE TCP gateway
 * Protocol: JSON frames {id, channel, opcode, value}
 */
export const PROTOCOL_STATES = {
  IDLE:       { channel: 0, opcode: 'ECHO',      value: 0   },
  INIT:       { channel: 1, opcode: 'ALLOC_NODE', value: 1   },
  FRACK:      { channel: 2, opcode: 'HUM',       value: 440 },
  DISPATCH:   { channel: 3, opcode: 'EXECUTE_PAYLOAD', value: 0 },
  RENDER:     { channel: 4, opcode: 'RENDER_FRAME',    value: 1 },
  COMPLETE:   { channel: 0, opcode: 'HALT',      value: 0   },
  FAULT:      { channel: 7, opcode: 'ECHO',      value: -1  },
};

export class SubkernelBridge {
  constructor() {
    this.ws = null;
    this.connected = false;
    this.pending = new Map();
    this.msgId = 0;
    this.reconnectInterval = null;
  }

  connect(host = '127.0.0.1', port = 8788) {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`ws://${host}:${port}`);
        this.ws.onopen = () => {
          this.connected = true;
          resolve();
        };
        this.ws.onclose = () => { this.connected = false; };
        this.ws.onerror = (e) => reject(e);
        this.ws.onmessage = (e) => {
          try {
            const resp = JSON.parse(e.data);
            if (resp.id && this.pending.has(resp.id)) {
              const { resolve, reject } = this.pending.get(resp.id);
              this.pending.delete(resp.id);
              if (resp.error) reject(new Error(resp.error));
              else resolve(resp.result);
            }
          } catch {}
        };
      } catch (e) { reject(e); }
    });
  }

  send(channel, opcode, value = 0) {
    return new Promise((resolve, reject) => {
      if (!this.connected) { reject(new Error('Not connected')); return; }
      const id = ++this.msgId;
      this.pending.set(id, { resolve, reject });
      const frame = JSON.stringify({ id, channel, opcode, value }) + '\n';
      this.ws.send(frame);
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error('Timeout'));
        }
      }, 5000);
    });
  }

  disconnect() {
    if (this.reconnectInterval) clearInterval(this.reconnectInterval);
    if (this.ws) this.ws.close();
    this.connected = false;
  }
}
