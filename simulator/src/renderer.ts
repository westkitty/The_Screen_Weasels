import type { FaceIdentity, FaceState } from '@screen-weasels/protocol';

export class ProceduralFaceRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public clear() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, 320, 240);
  }

  public renderFace(identity: FaceIdentity, state: FaceState, debug = false) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(state.x, state.y);
    ctx.scale(state.scale, state.scale);

    const eyeDistance = 34;
    const eyeWidth = identity.eyeShape === 'circular' ? 14 : 16;
    const eyeHeight = identity.eyeShape === 'squint' ? 6 : 14;

    // Eyebrows
    ctx.strokeStyle = identity.primaryColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    const browArousal = state.expression === 'startled' ? -8 : state.expression === 'suspicious' ? 6 : state.browAngle;

    // Left Brow
    ctx.beginPath();
    ctx.moveTo(-eyeDistance - 14, -22 + browArousal);
    ctx.lineTo(-eyeDistance + 14, -26 - browArousal);
    ctx.stroke();

    // Right Brow
    ctx.beginPath();
    ctx.moveTo(eyeDistance - 14, -26 - browArousal);
    ctx.lineTo(eyeDistance + 14, -22 + browArousal);
    ctx.stroke();

    // Eyes
    this.renderEye(-eyeDistance, -6, eyeWidth, eyeHeight, state.gazeX, state.gazeY, identity);
    this.renderEye(eyeDistance, -6, eyeWidth, eyeHeight, state.gazeX, state.gazeY, identity);

    // Cheeks
    ctx.fillStyle = identity.accentColor;
    ctx.beginPath();
    ctx.arc(-eyeDistance - 8, 14, 4, 0, Math.PI * 2);
    ctx.arc(eyeDistance + 8, 14, 4, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = identity.accentColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-5, 10);
    ctx.lineTo(5, 10);
    ctx.closePath();
    ctx.fill();

    // Mouth & Teeth
    const mouthY = 28;
    const mouthWidth = 26;
    const mouthOpen = Math.max(0, state.mouthOpen);

    ctx.fillStyle = '#000000';
    ctx.strokeStyle = identity.primaryColor;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.ellipse(0, mouthY, mouthWidth, 4 + mouthOpen * 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Teeth
    if (identity.toothType === 'sharp') {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      // Top tooth
      ctx.moveTo(-6, mouthY - 4 - mouthOpen * 5);
      ctx.lineTo(0, mouthY + 3);
      ctx.lineTo(6, mouthY - 4 - mouthOpen * 5);
      ctx.closePath();
      ctx.fill();
    } else if (identity.toothType === 'blunt') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(-5, mouthY - 4 - mouthOpen * 4, 10, 5);
    }

    if (debug) {
      // Debug bounding circle and gaze vector
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(state.gazeX * 30, state.gazeY * 30);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText(`${identity.name} [${state.expression}]`, -40, 56);
    }

    ctx.restore();
  }

  private renderEye(
    x: number,
    y: number,
    w: number,
    h: number,
    gazeX: number,
    gazeY: number,
    identity: FaceIdentity
  ) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y);

    // Eye outline
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = identity.primaryColor;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pupil
    const pupilR = Math.max(3, w * 0.35);
    const px = Math.max(-w + pupilR + 1, Math.min(w - pupilR - 1, gazeX * (w - pupilR)));
    const py = Math.max(-h + pupilR + 1, Math.min(h - pupilR - 1, gazeY * (h - pupilR)));

    ctx.fillStyle = identity.accentColor;
    ctx.beginPath();
    ctx.arc(px, py, pupilR, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
