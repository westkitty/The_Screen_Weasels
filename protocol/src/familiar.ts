import type { FamiliarSignal, HandState } from './types.js';

export const DEFAULT_FAMILIAR_PRIORITY = 10;
export const DEFAULT_FAMILIAR_DURATION_MS = 650;

export function clampUnit(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function isFamiliarSignalExpired(
  signal: FamiliarSignal | null | undefined,
  now = Date.now(),
): boolean {
  if (!signal) return true;
  if (signal.durationMs == null) return false;
  return now > signal.timestamp + signal.durationMs;
}

export function resolveFamiliarSignal(
  current: FamiliarSignal | null | undefined,
  incoming: FamiliarSignal,
  now = Date.now(),
): FamiliarSignal {
  if (!current || isFamiliarSignalExpired(current, now)) return incoming;

  const currentPriority = current.priority ?? DEFAULT_FAMILIAR_PRIORITY;
  const incomingPriority = incoming.priority ?? DEFAULT_FAMILIAR_PRIORITY;

  if (incomingPriority > currentPriority) return incoming;
  if (incomingPriority < currentPriority) return current;

  if (incoming.sequence > current.sequence) return incoming;
  if (incoming.sequence < current.sequence) return current;

  return incoming.timestamp >= current.timestamp ? incoming : current;
}

export function familiarSignalFromHand(
  hand: HandState,
  entityId: string,
  sequence: number,
  now = Date.now(),
): FamiliarSignal {
  const speed = Math.hypot(hand.vx, hand.vy);

  if (!hand.active) {
    return {
      entityId,
      source: 'screen-weasels.hand',
      attention: 'idle',
      reaction: 'neutral',
      intensity: 0,
      trigger: 'pointer',
      priority: 5,
      durationMs: 250,
      timestamp: now,
      sequence,
    };
  }

  const reaction =
    speed > 350
      ? 'startled'
      : speed > 30
        ? 'curious'
        : hand.clicked
          ? 'pleased'
          : 'neutral';

  const attention = speed > 350 ? 'interrupted' : 'focused';

  return {
    entityId,
    source: 'screen-weasels.hand',
    attention,
    reaction,
    intensity: clampUnit(Math.max(speed / 500, hand.edgeGlow)),
    look: {
      x: clampUnit(hand.x / 320) * 2 - 1,
      y: clampUnit(hand.y / 240) * 2 - 1,
    },
    trigger: 'pointer',
    priority: speed > 350 ? 50 : 20,
    durationMs: reaction === 'startled' ? 900 : DEFAULT_FAMILIAR_DURATION_MS,
    timestamp: now,
    sequence,
  };
}

export function familiarSignalFromTouch(
  entityId: string,
  sequence: number,
  rapidTouchCount: number,
  now = Date.now(),
): FamiliarSignal {
  const reaction =
    rapidTouchCount >= 4
      ? 'dizzy'
      : rapidTouchCount === 3
        ? 'irritated'
        : rapidTouchCount === 2
          ? 'pleased'
          : 'blink';

  return {
    entityId,
    source: 'screen-weasels.touch',
    attention: rapidTouchCount >= 4 ? 'interrupted' : 'aware',
    reaction,
    intensity: clampUnit(0.25 + rapidTouchCount * 0.18),
    trigger: 'touch',
    priority: rapidTouchCount >= 4 ? 70 : 35,
    durationMs: rapidTouchCount >= 4 ? 1200 : 700,
    timestamp: now,
    sequence,
  };
}
