import { WebSocketServer } from 'ws';
import { DEFAULT_WEBSOCKET_PORT, DEFAULT_WEBSOCKET_PATH } from '@screen-weasels/protocol';

console.log(`[Mock Host] Starting minimal test server on port ${DEFAULT_WEBSOCKET_PORT}...`);
const wss = new WebSocketServer({ port: DEFAULT_WEBSOCKET_PORT, path: DEFAULT_WEBSOCKET_PATH });

wss.on('connection', (ws) => {
  console.log('[Mock Host] Client connected.');

  ws.on('message', (data) => {
    console.log('[Mock Host] Got data from client:', data.toString());
  });

  // Periodically broadcast a mock hand update
  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({
        type: 'HAND_UPDATE',
        seq: 1,
        timestamp: Date.now(),
        payload: {
          active: true,
          shellId: 'shell_a',
          x: 160,
          y: 120,
          vx: 10,
          vy: 0,
          clicked: false,
          edgeGlow: 0.5,
        }
      }));
    }
  }, 1000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('[Mock Host] Client disconnected.');
  });
});
