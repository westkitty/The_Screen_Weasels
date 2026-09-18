import type { FamiliarSignal, FaceState } from '@screen-weasels/protocol';

export function applyFamiliarSignalToFaceState(
  state: FaceState,
  signal: FamiliarSignal,
): void {
  state.familiar = signal;


  switch (signal.reaction) {
    case 'startled':
      state.expression = 'startled';
      state.mouthOpen = Math.max(state.mouthOpen, 0.9 * signal.intensity);
      state.browAngle = -9 * signal.intensity;
      break;
    case 'curious':
      state.expression = 'curious';
      state.mouthOpen = Math.max(state.mouthOpen, 0.2 * signal.intensity);
      state.browAngle = -3 * signal.intensity;
      break;
    case 'pleased':
    case 'celebrate':
      state.expression = 'idle';
      state.mouthOpen = Math.max(state.mouthOpen, 0.35 * signal.intensity);
      state.browAngle = -2 * signal.intensity;
      break;
    case 'irritated':
    case 'warning':
      state.expression = 'suspicious';
      state.mouthOpen = Math.max(state.mouthOpen, 0.12);
      state.browAngle = 8 * signal.intensity;
      break;
    case 'dizzy':
      state.expression = 'struggling';
      state.mouthOpen = Math.max(state.mouthOpen, 0.5 * signal.intensity);
      state.browAngle = 4 * signal.intensity;
      break;
    case 'error':
      state.expression = 'struggling';
      state.mouthOpen = Math.max(state.mouthOpen, 0.7 * signal.intensity);
      state.browAngle = 10 * signal.intensity;
      break;
    case 'sleepy':
      state.expression = 'idle';
      state.mouthOpen = 0.05;
      state.browAngle = 2;
      break;
    case 'blink':
    case 'neutral':
    case undefined:
      break;
  }
}
