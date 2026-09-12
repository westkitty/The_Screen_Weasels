import type { FaceIdentity, FaceState } from '@screen-weasels/protocol';
import { ProceduralFaceRenderer } from './renderer.js';

export class ShellView {
  public id: 'shell_a' | 'shell_b';
  public canvas: HTMLCanvasElement;
  public glowEl: HTMLElement;
  private renderer: ProceduralFaceRenderer;

  constructor(id: 'shell_a' | 'shell_b', canvasId: string, glowId: string) {
    this.id = id;
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.glowEl = document.getElementById(glowId) as HTMLElement;
    const ctx = this.canvas.getContext('2d')!;
    this.renderer = new ProceduralFaceRenderer(ctx);
  }

  public setEdgeGlow(active: boolean) {
    if (active) {
      this.glowEl.classList.add('active');
    } else {
      this.glowEl.classList.remove('active');
    }
  }

  public render(faces: { identity: FaceIdentity; state: FaceState }[], debug: boolean) {
    this.renderer.clear();
    for (const { identity, state } of faces) {
      this.renderer.renderFace(identity, state, debug);
    }
  }
}
