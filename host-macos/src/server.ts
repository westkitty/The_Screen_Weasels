import { WebSocketServer, WebSocket } from 'ws';
import {
  DEFAULT_WEBSOCKET_PORT,
  DEFAULT_WEBSOCKET_PATH,
  WeaselMessageSchema,
  type WeaselMessage,
  type SyncedFace,
} from '@screen-weasels/protocol';
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
            const parsed = WeaselMessageSchema.safeParse(raw);
            if (parsed.success) {
              this.handleInboundMessage(ws, parsed.data);
            } else {
              console.warn('[Host] Rejected malformed message:', parsed.error.message);
              this.send(ws, 'PONG', {});
            }
          } catch (err) {
            console.error('[Host] Failed to parse JSON message:', err);
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

  private handleInboundMessage(ws: WebSocket, msg: WeaselMessage) {
    if (msg.type === 'SHELL_HELLO') {
      const shellId = msg.payload.shellId;
      this.connectedShells.set(shellId, ws);
      console.log(`[Host] Registered shell '${shellId}' (Heap: ${msg.payload.freeHeap} bytes, Firmware: ${msg.payload.firmwareVersion})`);

      // Immediately send authoritative FACE_SYNC carrying identity and state
      const primaryFace = this.engine.getFace('fixture_weasel_01');
      if (primaryFace) {
        this.send(ws, 'FACE_SYNC', { faces: [primaryFace] });
      }
    } else if (msg.type === 'TOUCH_EVENT') {
      console.log(`[Host] Touch from shell at (${msg.payload.x}, ${msg.payload.y}, active=${msg.payload.active})`);
    } else if (msg.type === 'PING') {
      this.send(ws, 'PONG', {});
    }
  }

  public broadcast(type: any, payload: any) {
    for (const ws of this.connectedShells.values()) {
      if (ws.readyState === WebSocket.OPEN) {
        this.send(ws, type, payload);
      }
    }
  }

  public send(ws: WebSocket, type: any, payload: any) {
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
