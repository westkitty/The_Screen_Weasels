import { test } from 'node:test';
import assert from 'node:assert';
import {
  HandStateSchema,
  FaceIdentitySchema,
  FaceStateSchema,
  SyncedFaceSchema,
  FaceSyncPayloadSchema,
  WeaselMessageSchema,
  FaceSyncMessageSchema,
  HandUpdateMessageSchema,
} from '../src/schemas.js';

test('HandState validates correct values and boundaries', () => {
  const validHand = {
    active: true,
    shellId: 'shell_a' as const,
    x: 160,
    y: 120,
    vx: 1.5,
    vy: -0.8,
    clicked: false,
    edgeGlow: 0.75,
  };
  assert.deepStrictEqual(HandStateSchema.parse(validHand), validHand);

  assert.throws(() => {
    HandStateSchema.parse({ ...validHand, x: 400 });
  });
});

test('FaceIdentity validates color formatting and features', () => {
  const validIdentity = {
    id: 'fixture_weasel_01',
    name: 'Green-Orange-Fixture',
    primaryColor: '#10B981',
    accentColor: '#F97316',
    eyeShape: 'almond' as const,
    toothType: 'sharp' as const,
    traitSeed: 42,
  };
  assert.deepStrictEqual(FaceIdentitySchema.parse(validIdentity), validIdentity);

  assert.throws(() => {
    FaceIdentitySchema.parse({ ...validIdentity, primaryColor: 'invalid-hex' });
  });
});

test('FACE_SYNC round-trip preserves identity and state completely', () => {
  const syncedFace = {
    identity: {
      id: 'fixture_weasel_01',
      name: 'Green-Orange-Fixture',
      primaryColor: '#10B981',
      accentColor: '#F97316',
      eyeShape: 'almond' as const,
      toothType: 'sharp' as const,
      traitSeed: 101,
    },
    state: {
      id: 'fixture_weasel_01',
      x: 160,
      y: 120,
      vx: 5.0,
      vy: -2.0,
      scale: 1.2,
      gazeX: 0.4,
      gazeY: -0.3,
      mouthOpen: 0.6,
      browAngle: -4,
      expression: 'curious' as const,
      grabbed: false,
    },
  };

  const payload = { faces: [syncedFace] };
  const validatedPayload = FaceSyncPayloadSchema.parse(payload);
  assert.deepStrictEqual(validatedPayload, payload);

  const message = {
    type: 'FACE_SYNC' as const,
    seq: 10,
    timestamp: 1726174800000,
    payload,
  };

  const serialized = JSON.stringify(message);
  const deserialized = JSON.parse(serialized);
  const parsedMessage = WeaselMessageSchema.parse(deserialized);

  assert.strictEqual(parsedMessage.type, 'FACE_SYNC');
  if (parsedMessage.type === 'FACE_SYNC') {
    const face = parsedMessage.payload.faces[0];
    assert.strictEqual(face.identity.id, 'fixture_weasel_01');
    assert.strictEqual(face.identity.primaryColor, '#10B981');
    assert.strictEqual(face.identity.accentColor, '#F97316');
    assert.strictEqual(face.identity.eyeShape, 'almond');
    assert.strictEqual(face.identity.toothType, 'sharp');
    assert.strictEqual(face.identity.traitSeed, 101);
    assert.strictEqual(face.state.scale, 1.2);
    assert.strictEqual(face.state.gazeX, 0.4);
    assert.strictEqual(face.state.expression, 'curious');
  }
});

test('WeaselMessageSchema rejects invalid payload for message type', () => {
  const invalidHandMessage = {
    type: 'HAND_UPDATE',
    seq: 1,
    timestamp: Date.now(),
    payload: {
      // Missing x, y, shellId etc.
      active: true,
    },
  };

  assert.throws(() => {
    WeaselMessageSchema.parse(invalidHandMessage);
  });
});

test('WeaselMessageSchema rejects unrecognized message types', () => {
  const unknownTypeMessage = {
    type: 'BOGUS_TYPE',
    seq: 1,
    timestamp: Date.now(),
    payload: {},
  };

  assert.throws(() => {
    WeaselMessageSchema.parse(unknownTypeMessage);
  });
});
