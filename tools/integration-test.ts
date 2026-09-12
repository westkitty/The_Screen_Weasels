import { test } from 'node:test';
import assert from 'node:assert';
import WebSocket from 'ws';
import { WeaselHostServer } from '../host-macos/src/server.js';
import { FaceSyncMessageSchema } from '@screen-weasels/protocol';

test('Host and Mock Shell integration handshake, FACE_SYNC, and error rejection', async () => {
  try {
    const TEST_PORT = 9100 + Math.floor(Math.random() * 500);
    const server = new WeaselHostServer();
    await server.start(TEST_PORT);

    const ws = new WebSocket(`ws://127.0.0.1:${TEST_PORT}/weasel`);
    const receivedMessages: any[] = [];

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Connection timed out')), 3000);
      ws.on('open', () => {
        clearTimeout(timeout);
        resolve();
      });
      ws.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    ws.on('message', (data) => {
      try {
        const parsed = JSON.parse(data.toString());
        receivedMessages.push(parsed);
      } catch (e) {
        console.error('Error parsing inbound message:', e);
      }
    });

    // Step 1: Send valid SHELL_HELLO
    const helloMessage = {
      type: 'SHELL_HELLO' as const,
      seq: 1,
      timestamp: Date.now(),
      payload: {
        shellId: 'shell_a' as const,
        firmwareVersion: '0.1.0-integration',
        freeHeap: 184500,
        macAddress: '24:6F:28:11:22:33',
      },
    };
    ws.send(JSON.stringify(helloMessage));

    // Step 2: Wait for FACE_SYNC response from host
    await new Promise<void>((resolve, reject) => {
      const start = Date.now();
      const interval = setInterval(() => {
        const faceSync = receivedMessages.find((m) => m.type === 'FACE_SYNC');
        if (faceSync) {
          clearInterval(interval);
          resolve();
        } else if (Date.now() - start > 2000) {
          clearInterval(interval);
          reject(new Error('Timed out waiting for FACE_SYNC'));
        }
      }, 20);
    });

    const faceSyncMsg = receivedMessages.find((m) => m.type === 'FACE_SYNC');
    assert.ok(faceSyncMsg, 'FACE_SYNC must be received upon SHELL_HELLO registration');

    const parsedFaceSync = FaceSyncMessageSchema.parse(faceSyncMsg);
    assert.strictEqual(parsedFaceSync.type, 'FACE_SYNC');
    const faces = parsedFaceSync.payload.faces;
    assert.ok(faces.length > 0, 'Must have at least one synced face');

    const firstFace = faces[0];
    assert.strictEqual(firstFace.identity.id, 'fixture_weasel_01');
    assert.strictEqual(firstFace.identity.primaryColor, '#10B981');
    assert.strictEqual(firstFace.identity.accentColor, '#F97316');
    assert.strictEqual(firstFace.identity.eyeShape, 'almond');
    assert.strictEqual(firstFace.identity.toothType, 'sharp');
    assert.strictEqual(firstFace.state.id, 'fixture_weasel_01');

    // Step 3: Send valid TOUCH_EVENT
    const touchMessage = {
      type: 'TOUCH_EVENT' as const,
      seq: 2,
      timestamp: Date.now(),
      payload: {
        active: true,
        x: 160,
        y: 120,
        pressure: 500,
      },
    };
    ws.send(JSON.stringify(touchMessage));

    // Step 4: Send malformed message
    const malformedMessage = {
      type: 'HAND_UPDATE',
      seq: 3,
      timestamp: Date.now(),
      payload: {
        active: 'invalid_boolean',
      },
    };
    ws.send(JSON.stringify(malformedMessage));

    await new Promise((r) => setTimeout(r, 100));

    // Step 5: Send PING to verify server is alive
    const pingMessage = {
      type: 'PING' as const,
      seq: 4,
      timestamp: Date.now(),
      payload: {},
    };
    ws.send(JSON.stringify(pingMessage));

    await new Promise<void>((resolve, reject) => {
      const start = Date.now();
      const interval = setInterval(() => {
        const pong = receivedMessages.find((m) => m.type === 'PONG');
        if (pong) {
          clearInterval(interval);
          resolve();
        } else if (Date.now() - start > 2000) {
          clearInterval(interval);
          reject(new Error('Server did not respond with PONG after malformed packet test'));
        }
      }, 20);
    });

    ws.terminate();
    await server.stop();
  } catch (err) {
    console.error('INTEGRATION TEST DETAILED ERROR:', err);
    throw err;
  }
});
