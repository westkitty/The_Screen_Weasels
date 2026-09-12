import { WebSocketServer, WebSocket } from 'ws';
import { DEFAULT_WEBSOCKET_PORT, DEFAULT_WEBSOCKET_PATH, EnvelopeSchema } from '@screen-weasels/protocol';
import { WorldStateEngine } from './state-engine.js';

export class WeaselHostServer {
  private wss: WebSocketServer | null = null;
  private connectedShells: Map<string, WebSocket> = new Map();
  public engine = new WorldStateEngine();
  private seq = 0;

  public start(port = DEFAULT_WEBSOCKET_PORT): Promise<void> {
    return new Promise((resolve) => {
      this.wss = new WebSocketServer({ port, path: DEFAULT_WEBSOCKET_PATH }, () => {
        console.log(`[Host] Screen Weasels Host listening on ws://localhost:${port}${DEFAULT_WEBSOCKET_PATH}`);
        resolve();
      });

      this.wss.on('connection', (ws: WebSocket, req) => {
        const clientIp = req.socket.remoteAddress;
        console.log(`[Host] Inbound connection from ${clientIp}`);

        ws.on('message', (data) => {
          try {
            const raw = JSON.parse(data.toString());
            const parsed = EnvelopeSchema.safeParse(raw);
            if (parsed.success) {
              this.handleInboundEnvelope(ws, parsed.data);
            } else {
              console.warn('[Host] Malformed envelope received:', parsed.error.message);
            }
          } catch (err) {
            console.error('[Host] Failed to parse message JSON:', err);
          }
        });

        ws.on('close', () => {
          for (const [id, socket] of this.connectedShells.entries()) {
            if (socket === ws) {
              console.log(`[Host] Shell disconnected: ${id}`);
              this.connectedShells.delete(id);
              break;
            }
          }
        });
      });
    });
  }

  private handleInboundEnvelope(ws: WebSocket, env: any) {
    if (env.type === 'SHELL_HELLO') {
      const shellId = env.payload.shellId || 'unknown_shell';
      this.connectedShells.set(shellId, ws);
      console.log(`[Host] Registered ${shellId} (Heap: ${env.payload.freeHeap} bytes, Version: ${env.payload.firmwareVersion})`);

      // Immediately sync primary face to shell
      const primaryFace = this.engine.getFace('weasel_01');
      if (primaryFace.identity && primaryFace.state) {
        this.send(ws, 'FACE_SYNC', { faces: [primaryFace.state] });
      }
    } else if (env.type === 'TOUCH_EVENT') {
      console.log(`[Host] Touch from shell at (${env.payload.x}, ${env.payload.y})`);
    }
  }

  public broadcast(type: string, payload: unknown) {
    for (const ws of this.connectedShells.values()) {
      if (ws.readyState === WebSocket.OPEN) {
        this.send(ws, type, payload);
      }
    }
  }

  private send(ws: WebSocket, type: string, payload: unknown) {
    const envelope = {
      type,
      seq: ++this.seq,
      timestamp: Date.now(),
      payload,
    };
    ws.send(JSON.stringify(envelope));
  }

  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.wss) {
        this.wss.close(() => resolve());
      } else {
        resolve();
      }
    });
  }
}
