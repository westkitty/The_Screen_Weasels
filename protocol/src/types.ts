import { z } from 'zod';
import {
  FamiliarAttentionSchema,
  FamiliarReactionSchema,
  FamiliarTriggerSchema,
  FamiliarSignalSchema,
  HandStateSchema,
  FaceIdentitySchema,
  FaceStateSchema,
  SyncedFaceSchema,
  FaceSyncPayloadSchema,
  AudioFeaturesSchema,
  TouchEventSchema,
  ShellHelloSchema,
  HandUpdateMessageSchema,
  FaceSyncMessageSchema,
  AudioFrameMessageSchema,
  ShellHelloMessageSchema,
  TouchEventMessageSchema,
  FamiliarSignalMessageSchema,
  PingMessageSchema,
  PongMessageSchema,
  WeaselMessageSchema,
  EnvelopeSchema,
} from './schemas.js';

export type FamiliarAttention = z.infer<typeof FamiliarAttentionSchema>;
export type FamiliarReaction = z.infer<typeof FamiliarReactionSchema>;
export type FamiliarTrigger = z.infer<typeof FamiliarTriggerSchema>;
export type FamiliarSignal = z.infer<typeof FamiliarSignalSchema>;

export type HandState = z.infer<typeof HandStateSchema>;
export type FaceIdentity = z.infer<typeof FaceIdentitySchema>;
export type FaceState = z.infer<typeof FaceStateSchema>;
export type SyncedFace = z.infer<typeof SyncedFaceSchema>;
export type FaceSyncPayload = z.infer<typeof FaceSyncPayloadSchema>;
export type AudioFeatures = z.infer<typeof AudioFeaturesSchema>;
export type TouchEvent = z.infer<typeof TouchEventSchema>;
export type ShellHello = z.infer<typeof ShellHelloSchema>;

export type HandUpdateMessage = z.infer<typeof HandUpdateMessageSchema>;
export type FaceSyncMessage = z.infer<typeof FaceSyncMessageSchema>;
export type AudioFrameMessage = z.infer<typeof AudioFrameMessageSchema>;
export type ShellHelloMessage = z.infer<typeof ShellHelloMessageSchema>;
export type TouchEventMessage = z.infer<typeof TouchEventMessageSchema>;
export type FamiliarSignalMessage = z.infer<typeof FamiliarSignalMessageSchema>;
export type PingMessage = z.infer<typeof PingMessageSchema>;
export type PongMessage = z.infer<typeof PongMessageSchema>;
export type WeaselMessage = z.infer<typeof WeaselMessageSchema>;
export type Envelope = z.infer<typeof EnvelopeSchema>;
