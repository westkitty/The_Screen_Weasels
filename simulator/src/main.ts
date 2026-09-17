import { familiarSignalFromHand, familiarSignalFromTouch, type FaceIdentity, type FaceState } from '@screen-weasels/protocol';
import { ShellView } from './shell-view.js';
import { MockHandController } from './mock-hand.js';
import { applyFamiliarSignalToFaceState } from './familiar-adapter.js';

/**
 * PROVISIONAL FIXTURE IDENTITIES
 * Used for development simulator and automated tests only.
 * Andrew has not yet chosen the canonical target cast.
 * fixture_weasel_01 represents the established green face with orange accents.
 */
const PROVISIONAL_FIXTURES: FaceIdentity[] = [
  { id: 'fixture_weasel_01', name: 'Green-Orange-Anchor', primaryColor: '#10B981', accentColor: '#F97316', eyeShape: 'almond', toothType: 'sharp', traitSeed: 1 },
  { id: 'fixture_weasel_02', name: 'Blue-Amber-Fixture', primaryColor: '#3B82F6', accentColor: '#FBBF24', eyeShape: 'circular', toothType: 'none', traitSeed: 2 },
  { id: 'fixture_weasel_03', name: 'Red-White-Fixture', primaryColor: '#EF4444', accentColor: '#FFFFFF', eyeShape: 'slanted', toothType: 'sharp', traitSeed: 3 },
  { id: 'fixture_weasel_04', name: 'Purple-Mint-Fixture', primaryColor: '#8B5CF6', accentColor: '#34D399', eyeShape: 'squint', toothType: 'none', traitSeed: 4 },
  { id: 'fixture_weasel_05', name: 'Amber-Pink-Fixture', primaryColor: '#F59E0B', accentColor: '#EC4899', eyeShape: 'circular', toothType: 'blunt', traitSeed: 5 },
  { id: 'fixture_weasel_06', name: 'Cyan-Slate-Fixture', primaryColor: '#06B6D4', accentColor: '#64748B', eyeShape: 'almond', toothType: 'blunt', traitSeed: 6 },
  { id: 'fixture_weasel_07', name: 'Rose-Purple-Fixture', primaryColor: '#F43F5E', accentColor: '#A855F7', eyeShape: 'slanted', toothType: 'none', traitSeed: 7 },
  { id: 'fixture_weasel_08', name: 'Gold-Navy-Fixture', primaryColor: '#EAB308', accentColor: '#1E293B', eyeShape: 'squint', toothType: 'sharp', traitSeed: 8 },
  { id: 'fixture_weasel_09', name: 'Slate-Silver-Fixture', primaryColor: '#94A3B8', accentColor: '#E2E8F0', eyeShape: 'almond', toothType: 'none', traitSeed: 9 },
];

interface CreatureEntity {
  identity: FaceIdentity;
  state: FaceState;
  targetGazeX: number;
  targetGazeY: number;
  nextGazeShiftTime: number; // Seconds until next scheduled gaze shift
}

class SimulatorEngine {
  private shellA: ShellView;
  private shellB: ShellView;
  private hand = new MockHandController();
  private debug = false;
  private faceCount = 1;
  private creaturesA: CreatureEntity[] = [];
  private creaturesB: CreatureEntity[] = [];
  private fpsLabel: HTMLElement;
  private frameCount = 0;
  private lastFpsUpdate = performance.now();
  private lastFrameTime = performance.now();
  private familiarSequence = 0;
  private rapidTouches = new Map<'shell_a' | 'shell_b', { count: number; at: number }>();

  constructor() {
    this.shellA = new ShellView('shell_a', 'canvas-a', 'glow-a');
    this.shellB = new ShellView('shell_b', 'canvas-b', 'glow-b');
    this.fpsLabel = document.getElementById('fps-label')!;

    this.initCreatures();
    this.setupEventListeners();
    this.loop();
  }

  private initCreatures() {
    this.creaturesA = [];
    this.creaturesB = [];

    const activeList = PROVISIONAL_FIXTURES.slice(0, this.faceCount);

    activeList.forEach((identity, i) => {
      const isShellA = i % 2 === 0;
      const entity: CreatureEntity = {
        identity,
        state: {
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
        },
        targetGazeX: 0,
        targetGazeY: 0,
        nextGazeShiftTime: 1.5 + Math.random() * 2.0, // 1.5 - 3.5s real time
      };

      if (isShellA || this.faceCount === 1) {
        this.creaturesA.push(entity);
      } else {
        this.creaturesB.push(entity);
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

      shell.canvas.addEventListener('click', () => {
        const now = Date.now();
        const previous = this.rapidTouches.get(shell.id) ?? { count: 0, at: 0 };
        const count = now - previous.at < 1600 ? previous.count + 1 : 1;
        const next = { count: count >= 4 ? 0 : count, at: now };
        this.rapidTouches.set(shell.id, next);

        const signal = familiarSignalFromTouch(
          'fixture_weasel_01',
          ++this.familiarSequence,
          count,
          now,
        );

        const targets = shell.id === 'shell_a' ? this.creaturesA : this.creaturesB;
        for (const entity of targets) {
          applyFamiliarSignalToFaceState(entity.state, {
            ...signal,
            entityId: entity.identity.id,
          });
        }
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
      if (this.creaturesA.length > 0) {
        const moved = this.creaturesA.pop()!;
        this.creaturesB.push(moved);
      } else if (this.creaturesB.length > 0) {
        const moved = this.creaturesB.pop()!;
        this.creaturesA.push(moved);
      }
    });
  }

  private setFaceCount(count: number, activeBtnId: string) {
    this.faceCount = count;
    ['btn-face-1', 'btn-face-3', 'btn-face-9'].forEach(id => {
      document.getElementById(id)?.classList.toggle('active', id === activeBtnId);
    });
    this.initCreatures();
  }

  private updateCreatures(creatures: CreatureEntity[], shellId: 'shell_a' | 'shell_b', dt: number) {
    const hand = this.hand.state;
    const handInThisShell = hand.active && hand.shellId === shellId;
    const handSpeed = Math.hypot(hand.vx, hand.vy);
    const dwell = this.hand.dwellTime;

    for (const entity of creatures) {
      const { state } = entity;

      if (handInThisShell) {
        const dx = hand.x - state.x;
        const dy = hand.y - state.y;
        const dist = Math.hypot(dx, dy) || 1;

        // Target gaze locks onto Hand
        entity.targetGazeX = Math.max(-1, Math.min(1, (dx / dist) * 0.95));
        entity.targetGazeY = Math.max(-1, Math.min(1, (dy / dist) * 0.95));

        const signal = familiarSignalFromHand(
          hand,
          entity.identity.id,
          ++this.familiarSequence,
          Date.now(),
        );
        applyFamiliarSignalToFaceState(state, signal);

        if (dwell > 0.6 && handSpeed <= 25 && !hand.clicked) {
          state.expression = 'idle';
          state.mouthOpen = Math.max(0, state.mouthOpen - dt * 2.0);
        }

        // Fast gaze snap when Hand is active
        const gazeLerpRate = state.expression === 'startled' ? 18.0 : 8.0;
        state.gazeX += (entity.targetGazeX - state.gazeX) * Math.min(1.0, dt * gazeLerpRate);
        state.gazeY += (entity.targetGazeY - state.gazeY) * Math.min(1.0, dt * gazeLerpRate);
      } else {
        // Hand not present: Time-based natural idle gaze schedule (1.5 - 3.5 seconds)
        entity.nextGazeShiftTime -= dt;
        if (entity.nextGazeShiftTime <= 0) {
          entity.targetGazeX = (Math.random() - 0.5) * 0.8;
          entity.targetGazeY = (Math.random() - 0.5) * 0.5;
          entity.nextGazeShiftTime = 1.5 + Math.random() * 2.0;
        }

        // Smooth continuous interpolation toward scheduled target (no sudden frame jumps)
        state.gazeX += (entity.targetGazeX - state.gazeX) * Math.min(1.0, dt * 3.5);
        state.gazeY += (entity.targetGazeY - state.gazeY) * Math.min(1.0, dt * 3.5);

        state.expression = 'idle';
        state.mouthOpen = Math.max(0, state.mouthOpen - dt * 1.5);
      }
    }
  }

  private loop = () => {
    const now = performance.now();
    const dt = Math.min(0.1, Math.max(0.001, (now - this.lastFrameTime) / 1000));
    this.lastFrameTime = now;

    this.hand.updateIdleTime(dt);

    this.updateCreatures(this.creaturesA, 'shell_a', dt);
    this.updateCreatures(this.creaturesB, 'shell_b', dt);

    this.shellA.render(this.creaturesA, this.debug);
    this.shellB.render(this.creaturesB, this.debug);

    this.frameCount++;
    if (now - this.lastFpsUpdate >= 500) {
      const fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      const handStateDesc = this.hand.state.active
        ? `${this.hand.state.shellId} (spd=${Math.round(Math.hypot(this.hand.state.vx, this.hand.state.vy))}, dwell=${this.hand.dwellTime.toFixed(1)}s)`
        : 'Inactive';
      this.fpsLabel.textContent = `FPS: ${fps} | Hand: ${handStateDesc}`;
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }

    requestAnimationFrame(this.loop);
  };
}

window.addEventListener('DOMContentLoaded', () => {
  new SimulatorEngine();
});
