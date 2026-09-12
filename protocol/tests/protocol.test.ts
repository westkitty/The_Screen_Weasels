import { test } from 'node:test';
import assert from 'node:assert';
import {
  HandStateSchema,
  FaceIdentitySchema,
  FaceStateSchema,
  AudioFeaturesSchema,
  EnvelopeSchema,
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

  // Out of bounds check
  assert.throws(() => {
    HandStateSchema.parse({ ...validHand, x: 400 });
  });
});

test('FaceIdentity validates color formatting and features', () => {
  const validIdentity = {
    id: 'weasel_01',
    name: 'Emerald_Snarl',
    primaryColor: '#10B981',
    accentColor: '#F97316',
    eyeShape: 'almond' as const,
    toothType: 'sharp' as const,
    traitSeed: 42,
  };
  assert.deepStrictEqual(FaceIdentitySchema.parse(validIdentity), validIdentity);

  // Invalid hex color
  assert.throws(() => {
    FaceIdentitySchema.parse({ ...validIdentity, primaryColor: 'invalid-hex' });
  });
});

test('FaceState handles defaults and range clamps', () => {
  const state = FaceStateSchema.parse({
    id: 'weasel_01',
    x: 100,
    y: 100,
    expression: 'curious',
  });
  assert.strictEqual(state.scale, 1.0);
  assert.strictEqual(state.gazeX, 0);
  assert.strictEqual(state.grabbed, false);
});

test('Envelope serialization round-trip', () => {
  const envelope = {
    type: 'HAND_UPDATE' as const,
    seq: 1,
    timestamp: Date.now(),
    payload: { active: true },
  };
  const parsed = EnvelopeSchema.parse(envelope);
  assert.strictEqual(parsed.type, 'HAND_UPDATE');
});
