import { z } from 'zod';

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

export const EnvelopeSchema = z.object({
  type: z.enum(['HAND_UPDATE', 'FACE_SYNC', 'AUDIO_FRAME', 'SHELL_HELLO', 'TOUCH_EVENT', 'PING', 'PONG']),
  seq: z.number(),
  timestamp: z.number(),
  payload: z.unknown(),
});
