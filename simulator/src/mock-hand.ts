import type { HandState } from '@screen-weasels/protocol';

export class MockHandController {
  public state: HandState = {
    active: false,
    shellId: 'none',
    x: 160,
    y: 120,
    vx: 0,
    vy: 0,
    clicked: false,
    edgeGlow: 0,
  };

  public dwellTime = 0; // Duration spent stationary in seconds
  private lastTime = performance.now();
  private lastX = 160;
  private lastY = 120;

  public updatePosition(shellId: 'shell_a' | 'shell_b', clientX: number, clientY: number, clicked: boolean) {
    const now = performance.now();
    const dt = Math.max(0.001, (now - this.lastTime) / 1000);

    const vx = (clientX - this.lastX) / dt;
    const vy = (clientY - this.lastY) / dt;
    const speed = Math.hypot(vx, vy);

    if (speed < 25) {
      this.dwellTime += dt;
    } else {
      this.dwellTime = 0;
    }

    this.state = {
      active: true,
      shellId,
      x: Math.max(0, Math.min(320, clientX)),
      y: Math.max(0, Math.min(240, clientY)),
      vx,
      vy,
      clicked,
      edgeGlow: 1.0,
    };

    this.lastX = clientX;
    this.lastY = clientY;
    this.lastTime = now;
  }

  public updateIdleTime(dt: number) {
    if (this.state.active) {
      this.dwellTime += dt;
      // Damp velocity toward 0
      this.state.vx *= Math.exp(-dt * 6);
      this.state.vy *= Math.exp(-dt * 6);
    }
  }

  public deactivate() {
    this.state.active = false;
    this.state.shellId = 'none';
    this.state.edgeGlow = 0;
    this.state.vx = 0;
    this.state.vy = 0;
    this.dwellTime = 0;
  }
}
