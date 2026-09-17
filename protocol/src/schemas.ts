import { z } from 'zod';

export const FamiliarAttentionSchema = z.enum([
  'idle',
  'aware',
  'focused',
  'interrupted',
  'urgent',
]);

export const FamiliarReactionSchema = z.enum([
  'neutral',
  'blink',
  'curious',
  'startled',
  'pleased',
  'irritated',
  'sleepy',
  'dizzy',
  'celebrate',
  'warning',
  'error',
]);

export const FamiliarTriggerSchema = z.enum([
  'pointer',
  'touch',
  'audio',
  'system',
  'agent',
  'timer',
  'world',
]);

export const FamiliarSignalSchema = z.object({
  entityId: z.string().min(1),
  source: z.string().min(1),
  attention: FamiliarAttentionSchema,
  reaction: FamiliarReactionSchema.optional(),
  intensity: z.number().min(0).max(1),
  look: z.object({
    x: z.number().min(-1).max(1),
    y: z.number().min(-1).max(1),
  }).optional(),
  trigger: FamiliarTriggerSchema,
  priority: z.number().int().min(0).max(100).optional(),
  durationMs: z.number().int().positive().optional(),
  timestamp: z.number(),
  sequence: z.number().int().nonnegative(),
});

export const HandStateSchema = z.object({
  active: z.boolean(),
  shellId: z.enum(['shell_a', 'shell_b', 'none']),
  x: z.number().min(0).max(320),
  y: z.number().min(0).max(240),
  vx: z.number(),
  vy: z.number(),
  clicked: z.boolean(),
  edgeGlow: z.number().min(0).max(1),
});

export const FaceIdentitySchema = z.object({
  id: z.string(),
  name: z.string(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  eyeShape: z.enum(['almond', 'circular', 'slanted', 'squint']),
  toothType: z.enum(['sharp', 'blunt', 'none']),
  traitSeed: z.number(),
});

export const FaceStateSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  vx: z.number().default(0),
  vy: z.number().default(0),
  scale: z.number().default(1.0),
  gazeX: z.number().min(-1).max(1).default(0),
  gazeY: z.number().min(-1).max(1).default(0),
  mouthOpen: z.number().min(0).max(1).default(0),
  browAngle: z.number().default(0),
  expression: z.enum(['idle', 'curious', 'startled', 'suspicious', 'singing', 'struggling']),
  grabbed: z.boolean().default(false),
  familiar: FamiliarSignalSchema.optional(),
});

export const SyncedFaceSchema = z.object({
  identity: FaceIdentitySchema,
  state: FaceStateSchema,
});

export const FaceSyncPayloadSchema = z.object({
  faces: z.array(SyncedFaceSchema),
});

export const AudioFeaturesSchema = z.object({
  rms: z.number().min(0).max(1),
  bass: z.number().min(0).max(1),
  mid: z.number().min(0).max(1),
  treble: z.number().min(0).max(1),
  beat: z.boolean(),
  timestamp: z.number(),
});

export const TouchEventSchema = z.object({
  active: z.boolean(),
  x: z.number().min(0).max(320),
  y: z.number().min(0).max(240),
  pressure: z.number().default(0),
});

export const ShellHelloSchema = z.object({
  shellId: z.enum(['shell_a', 'shell_b']),
  firmwareVersion: z.string(),
  freeHeap: z.number(),
  macAddress: z.string(),
});

export const HandUpdateMessageSchema = z.object({
  type: z.literal('HAND_UPDATE'),
  seq: z.number(),
  timestamp: z.number(),
  payload: HandStateSchema,
});

export const FaceSyncMessageSchema = z.object({
  type: z.literal('FACE_SYNC'),
  seq: z.number(),
  timestamp: z.number(),
  payload: FaceSyncPayloadSchema,
});

export const AudioFrameMessageSchema = z.object({
  type: z.literal('AUDIO_FRAME'),
  seq: z.number(),
  timestamp: z.number(),
  payload: AudioFeaturesSchema,
});

export const ShellHelloMessageSchema = z.object({
  type: z.literal('SHELL_HELLO'),
  seq: z.number(),
  timestamp: z.number(),
  payload: ShellHelloSchema,
});

export const TouchEventMessageSchema = z.object({
  type: z.literal('TOUCH_EVENT'),
  seq: z.number(),
  timestamp: z.number(),
  payload: TouchEventSchema,
});

export const FamiliarSignalMessageSchema = z.object({
  type: z.literal('FAMILIAR_SIGNAL'),
  seq: z.number(),
  timestamp: z.number(),
  payload: FamiliarSignalSchema,
});

export const PingMessageSchema = z.object({
  type: z.literal('PING'),
  seq: z.number(),
  timestamp: z.number(),
  payload: z.object({}).optional().default({}),
});

export const PongMessageSchema = z.object({
  type: z.literal('PONG'),
  seq: z.number(),
  timestamp: z.number(),
  payload: z.object({}).optional().default({}),
});

export const WeaselMessageSchema = z.discriminatedUnion('type', [
  HandUpdateMessageSchema,
  FaceSyncMessageSchema,
  AudioFrameMessageSchema,
  ShellHelloMessageSchema,
  TouchEventMessageSchema,
  FamiliarSignalMessageSchema,
  PingMessageSchema,
  PongMessageSchema,
]);

export const EnvelopeSchema = z.object({
  type: z.enum([
    'HAND_UPDATE',
    'FACE_SYNC',
    'AUDIO_FRAME',
    'SHELL_HELLO',
    'TOUCH_EVENT',
    'FAMILIAR_SIGNAL',
    'PING',
    'PONG',
  ]),
  seq: z.number(),
  timestamp: z.number(),
  payload: z.unknown(),
});
