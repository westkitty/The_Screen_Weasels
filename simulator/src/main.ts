import type { FaceIdentity, FaceState } from '@screen-weasels/protocol';
import { ShellView } from './shell-view.js';
import { MockHandController } from './mock-hand.js';

const IDENTITIES: FaceIdentity[] = [
  { id: 'w1', name: 'Emerald-Snarl', primaryColor: '#10B981', accentColor: '#F97316', eyeShape: 'almond', toothType: 'sharp', traitSeed: 1 },
  { id: 'w2', name: 'Cobalt-Stare', primaryColor: '#3B82F6', accentColor: '#FBBF24', eyeShape: 'circular', toothType: 'none', traitSeed: 2 },
  { id: 'w3', name: 'Crimson-Scowl', primaryColor: '#EF4444', accentColor: '#FFFFFF', eyeShape: 'slanted', toothType: 'sharp', traitSeed: 3 },
  { id: 'w4', name: 'Violet-Slink', primaryColor: '#8B5CF6', accentColor: '#34D399', eyeShape: 'squint', toothType: 'none', traitSeed: 4 },
  { id: 'w5', name: 'Amber-Snap', primaryColor: '#F59E0B', accentColor: '#EC4899', eyeShape: 'circular', toothType: 'blunt', traitSeed: 5 },
  { id: 'w6', name: 'Cyan-Ghost', primaryColor: '#06B6D4', accentColor: '#64748B', eyeShape: 'almond', toothType: 'blunt', traitSeed: 6 },
  { id: 'w7', name: 'Rose-Flicker', primaryColor: '#F43F5E', accentColor: '#A855F7', eyeShape: 'slanted', toothType: 'none', traitSeed: 7 },
  { id: 'w8', name: 'Gold-Mask', primaryColor: '#EAB308', accentColor: '#1E293B', eyeShape: 'squint', toothType: 'sharp', traitSeed: 8 },
  { id: 'w9', name: 'Slate-Prowl', primaryColor: '#94A3B8', accentColor: '#E2E8F0', eyeShape: 'almond', toothType: 'none', traitSeed: 9 },
];

class SimulatorEngine {
  private shellA: ShellView;
  private shellB: ShellView;
  private hand = new MockHandController();
  private debug = false;
  private faceCount = 1;
  private facesA: { identity: FaceIdentity; state: FaceState }[] = [];
  private facesB: { identity: FaceIdentity; state: FaceState }[] = [];
  private fpsLabel: HTMLElement;
  private frameCount = 0;
  private lastFpsUpdate = performance.now();

  constructor() {
    this.shellA = new ShellView('shell_a', 'canvas-a', 'glow-a');
    this.shellB = new ShellView('shell_b', 'canvas-b', 'glow-b');
    this.fpsLabel = document.getElementById('fps-label')!;

    this.initFaces();
    this.setupEventListeners();
    this.loop();
  }

  private initFaces() {
    this.facesA = [];
    this.facesB = [];

    const activeList = IDENTITIES.slice(0, this.faceCount);

    activeList.forEach((identity, i) => {
      const isShellA = i % 2 === 0;
      const faceState: FaceState = {
        id: identity.id,
        x: 160 + (Math.random() - 0.5) * 60,
        y: 120 + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0,
        scale: this.faceCount === 1 ? 1.4 : this.faceCount <= 3 ? 1.0 : 0.65,
        gazeX: 0,
        gazeY: 0,
        mouthOpen: 0,
        browAngle: 0,
        expression: 'idle',
        grabbed: false,
      };

      if (isShellA || this.faceCount === 1) {
        this.facesA.push({ identity, state: faceState });
      } else {
        this.facesB.push({ identity, state: faceState });
      }
    });
  }

  private setupEventListeners() {
    const bindShellEvents = (shell: ShellView) => {
      shell.canvas.addEventListener('mousemove', (e) => {
        const rect = shell.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (320 / rect.width);
        const y = (e.clientY - rect.top) * (240 / rect.height);
        this.hand.updatePosition(shell.id, x, y, e.buttons === 1);
        shell.setEdgeGlow(true);
      });

      shell.canvas.addEventListener('mouseleave', () => {
        this.hand.deactivate();
        shell.setEdgeGlow(false);
      });
    };

    bindShellEvents(this.shellA);
    bindShellEvents(this.shellB);

    document.getElementById('btn-face-1')?.addEventListener('click', () => this.setFaceCount(1, 'btn-face-1'));
    document.getElementById('btn-face-3')?.addEventListener('click', () => this.setFaceCount(3, 'btn-face-3'));
    document.getElementById('btn-face-9')?.addEventListener('click', () => this.setFaceCount(9, 'btn-face-9'));

    const debugBtn = document.getElementById('btn-debug');
    debugBtn?.addEventListener('click', () => {
      this.debug = !this.debug;
      debugBtn.textContent = `Debug Overlays: ${this.debug ? 'ON' : 'OFF'}`;
    });

    document.getElementById('btn-migrate')?.addEventListener('click', () => {
      if (this.facesA.length > 0) {
        const moved = this.facesA.pop()!;
        this.facesB.push(moved);
      } else if (this.facesB.length > 0) {
        const moved = this.facesB.pop()!;
        this.facesA.push(moved);
      }
    });
  }

  private setFaceCount(count: number, activeBtnId: string) {
    this.faceCount = count;
    ['btn-face-1', 'btn-face-3', 'btn-face-9'].forEach(id => {
      document.getElementById(id)?.classList.toggle('active', id === activeBtnId);
    });
    this.initFaces();
  }

  private updateCreatures(faces: { identity: FaceIdentity; state: FaceState }[], shellId: 'shell_a' | 'shell_b') {
    const hand = this.hand.state;
    const handInThisShell = hand.active && hand.shellId === shellId;
    const handSpeed = Math.hypot(hand.vx, hand.vy);

    for (const { state } of faces) {
      if (handInThisShell) {
        const dx = hand.x - state.x;
        const dy = hand.y - state.y;
        const dist = Math.hypot(dx, dy) || 1;

        // Gaze tracking
        state.gazeX = Math.max(-1, Math.min(1, (dx / dist) * 0.9));
        state.gazeY = Math.max(-1, Math.min(1, (dy / dist) * 0.9));

        if (handSpeed > 400) {
          state.expression = 'startled';
          state.mouthOpen = 0.8;
        } else if (handSpeed > 100) {
          state.expression = 'curious';
          state.mouthOpen = 0.2;
        } else {
          state.expression = 'idle';
          state.mouthOpen = 0.05;
        }
      } else {
        // Natural idle gaze drift
        if (Math.random() < 0.02) {
          state.gazeX = (Math.random() - 0.5) * 0.8;
          state.gazeY = (Math.random() - 0.5) * 0.5;
        }
        state.expression = 'idle';
        state.mouthOpen = Math.max(0, state.mouthOpen - 0.05);
      }
    }
  }

  private loop = () => {
    this.updateCreatures(this.facesA, 'shell_a');
    this.updateCreatures(this.facesB, 'shell_b');

    this.shellA.render(this.facesA, this.debug);
    this.shellB.render(this.facesB, this.debug);

    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsUpdate >= 500) {
      const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.fpsLabel.textContent = `FPS: ${fps} | Hand: ${this.hand.state.active ? `${this.hand.state.shellId} (${Math.round(this.hand.state.x)}, ${Math.round(this.hand.state.y)})` : 'Inactive'}`;
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }

    requestAnimationFrame(this.loop);
  };
}

window.addEventListener('DOMContentLoaded', () => {
  new SimulatorEngine();
});
