import WebSocket from 'ws';
import { DEFAULT_WEBSOCKET_PORT, DEFAULT_WEBSOCKET_PATH, EnvelopeSchema } from '@screen-weasels/protocol';

const shellId = process.argv[2] || 'shell_a';
const url = `ws://localhost:${DEFAULT_WEBSOCKET_PORT}${DEFAULT_WEBSOCKET_PATH}`;

console.log(`[Mock Device] Starting simulated CYD (${shellId}) -> connecting to ${url}`);
const ws = new WebSocket(url);

ws.on('open', () => {
  console.log(`[Mock Device] Connected to host. Sending SHELL_HELLO...`);
  const hello = {
    type: 'SHELL_HELLO',
    seq: 1,
    timestamp: Date.now(),
    payload: {
      shellId,
      firmwareVersion: '0.1.0-mock',
      freeHeap: 182400,
      macAddress: '24:6F:28:AA:BB:CC',
    },
  };
  ws.send(JSON.stringify(hello));

  // Periodically send touch events to simulate hardware touch
  setInterval(() => {
    const touch = {
      type: 'TOUCH_EVENT',
      seq: 2,
      timestamp: Date.now(),
      payload: {
        active: true,
        x: 160 + Math.round((Math.random() - 0.5) * 40),
        y: 120 + Math.round((Math.random() - 0.5) * 40),
        pressure: 450,
      },
    };
    ws.send(JSON.stringify(touch));
  }, 5000);
});

ws.on('message', (data) => {
  try {
    const msg = JSON.parse(data.toString());
    console.log(`[Mock Device] Received ${msg.type} seq=${msg.seq}`);
  } catch (err) {
    console.error('[Mock Device] Failed to parse message:', err);
  }
});

ws.on('close', () => {
  console.log('[Mock Device] Disconnected from host.');
  process.exit(0);
});
