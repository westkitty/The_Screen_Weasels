import { test } from 'node:test';
import assert from 'node:assert';
import {
  FamiliarSignalSchema,
  HandStateSchema,
  FaceIdentitySchema,
  FaceStateSchema,
  FaceSyncPayloadSchema,
  WeaselMessageSchema,
} from '../src/schemas.js';
import {
  familiarSignalFromHand,
  familiarSignalFromTouch,
  isFamiliarSignalExpired,
  resolveFamiliarSignal,
} from '../src/familiar.js';

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
  assert.throws(() => HandStateSchema.parse({ ...validHand, x: 400 }));
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
  assert.throws(() => FaceIdentitySchema.parse({ ...validIdentity, primaryColor: 'invalid-hex' }));
});

test('FACE_SYNC remains backward compatible without familiar state', () => {
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
      vx: 5,
      vy: -2,
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
  assert.deepStrictEqual(FaceSyncPayloadSchema.parse(payload), payload);
});

test('FamiliarSignal validates renderer-neutral semantic state', () => {
  const signal = {
    entityId: 'fixture_weasel_01',
    source: 'screen-weasels.hand',
    attention: 'focused' as const,
    reaction: 'curious' as const,
    intensity: 0.5,
    look: { x: 0.25, y: -0.5 },
    trigger: 'pointer' as const,
    priority: 20,
    durationMs: 650,
    timestamp: 1000,
    sequence: 4,
  };

  assert.deepStrictEqual(FamiliarSignalSchema.parse(signal), signal);
  assert.throws(() => FamiliarSignalSchema.parse({ ...signal, intensity: 1.5 }));
});

test('FAMILIAR_SIGNAL is a valid protocol message', () => {
  const message = {
    type: 'FAMILIAR_SIGNAL' as const,
    seq: 11,
    timestamp: 1000,
    payload: {
      entityId: 'fixture_weasel_01',
      source: 'screen-weasels.touch',
      attention: 'aware' as const,
      reaction: 'blink' as const,
      intensity: 0.4,
      trigger: 'touch' as const,
      timestamp: 1000,
      sequence: 3,
    },
  };

  const parsed = WeaselMessageSchema.parse(message);
  assert.strictEqual(parsed.type, 'FAMILIAR_SIGNAL');
});

test('hand semantics preserve continuous look while classifying reaction', () => {
  const signal = familiarSignalFromHand({
    active: true,
    shellId: 'shell_a',
    x: 240,
    y: 60,
    vx: 400,
    vy: 0,
    clicked: false,
    edgeGlow: 0.8,
  }, 'fixture_weasel_01', 7, 2000);

  assert.strictEqual(signal.reaction, 'startled');
  assert.strictEqual(signal.attention, 'interrupted');
  assert.ok(signal.look);
  assert.ok(Math.abs(signal.look!.x - 0.5) < 0.0001);
  assert.ok(Math.abs(signal.look!.y + 0.5) < 0.0001);
});

test('rapid touches escalate without becoming personality logic', () => {
  assert.strictEqual(familiarSignalFromTouch('fixture_weasel_01', 1, 1, 1000).reaction, 'blink');
  assert.strictEqual(familiarSignalFromTouch('fixture_weasel_01', 2, 2, 1100).reaction, 'pleased');
  assert.strictEqual(familiarSignalFromTouch('fixture_weasel_01', 3, 3, 1200).reaction, 'irritated');
  assert.strictEqual(familiarSignalFromTouch('fixture_weasel_01', 4, 4, 1300).reaction, 'dizzy');
});

test('arbitration honors TTL, priority, and sequence deterministically', () => {
  const current = familiarSignalFromTouch('fixture_weasel_01', 4, 4, 1000);
  const lowPriority = familiarSignalFromHand({
    active: true,
    shellId: 'shell_a',
    x: 100,
    y: 100,
    vx: 40,
    vy: 0,
    clicked: false,
    edgeGlow: 0.1,
  }, 'fixture_weasel_01', 5, 1100);

  assert.strictEqual(resolveFamiliarSignal(current, lowPriority, 1150).reaction, 'dizzy');
  assert.strictEqual(isFamiliarSignalExpired(current, 2300), true);
  assert.strictEqual(resolveFamiliarSignal(current, lowPriority, 2300).reaction, 'curious');
});

test('WeaselMessageSchema rejects invalid payload for message type', () => {
  assert.throws(() => {
    WeaselMessageSchema.parse({
      type: 'HAND_UPDATE',
      seq: 1,
      timestamp: Date.now(),
      payload: { active: true },
    });
  });
});

test('WeaselMessageSchema rejects unrecognized message types', () => {
  assert.throws(() => {
    WeaselMessageSchema.parse({
      type: 'BOGUS_TYPE',
      seq: 1,
      timestamp: Date.now(),
      payload: {},
    });
  });
});
