import { z } from 'zod';
import {
  HandStateSchema,
  FaceIdentitySchema,
  FaceStateSchema,
  AudioFeaturesSchema,
  TouchEventSchema,
  ShellHelloSchema,
  EnvelopeSchema,
} from './schemas.js';

export type HandState = z.infer<typeof HandStateSchema>;
export type FaceIdentity = z.infer<typeof FaceIdentitySchema>;
export type FaceState = z.infer<typeof FaceStateSchema>;
export type AudioFeatures = z.infer<typeof AudioFeaturesSchema>;
export type TouchEvent = z.infer<typeof TouchEventSchema>;
export type ShellHello = z.infer<typeof ShellHelloSchema>;
export type Envelope = z.infer<typeof EnvelopeSchema>;
