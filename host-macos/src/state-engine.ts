import type { FaceIdentity, FaceState } from '@screen-weasels/protocol';

export class WorldStateEngine {
  public identities: Map<string, FaceIdentity> = new Map();
  public faceStates: Map<string, FaceState> = new Map();

  constructor() {
    this.seedIdentities();
  }

  private seedIdentities() {
    const list: FaceIdentity[] = [
      { id: 'weasel_01', name: 'Emerald-Snarl', primaryColor: '#10B981', accentColor: '#F97316', eyeShape: 'almond', toothType: 'sharp', traitSeed: 101 },
      { id: 'weasel_02', name: 'Cobalt-Stare', primaryColor: '#3B82F6', accentColor: '#FBBF24', eyeShape: 'circular', toothType: 'none', traitSeed: 102 },
      { id: 'weasel_03', name: 'Crimson-Scowl', primaryColor: '#EF4444', accentColor: '#FFFFFF', eyeShape: 'slanted', toothType: 'sharp', traitSeed: 103 },
      { id: 'weasel_04', name: 'Violet-Slink', primaryColor: '#8B5CF6', accentColor: '#34D399', eyeShape: 'squint', toothType: 'none', traitSeed: 104 },
      { id: 'weasel_05', name: 'Amber-Snap', primaryColor: '#F59E0B', accentColor: '#EC4899', eyeShape: 'circular', toothType: 'blunt', traitSeed: 105 },
      { id: 'weasel_06', name: 'Cyan-Ghost', primaryColor: '#06B6D4', accentColor: '#64748B', eyeShape: 'almond', toothType: 'blunt', traitSeed: 106 },
      { id: 'weasel_07', name: 'Rose-Flicker', primaryColor: '#F43F5E', accentColor: '#A855F7', eyeShape: 'slanted', toothType: 'none', traitSeed: 107 },
      { id: 'weasel_08', name: 'Gold-Mask', primaryColor: '#EAB308', accentColor: '#1E293B', eyeShape: 'squint', toothType: 'sharp', traitSeed: 108 },
      { id: 'weasel_09', name: 'Slate-Prowl', primaryColor: '#94A3B8', accentColor: '#E2E8F0', eyeShape: 'almond', toothType: 'none', traitSeed: 109 },
    ];

    for (const item of list) {
      this.identities.set(item.id, item);
      this.faceStates.set(item.id, {
        id: item.id,
        x: 160,
        y: 120,
        vx: 0,
        vy: 0,
        scale: 1.0,
        gazeX: 0,
        gazeY: 0,
        mouthOpen: 0,
        browAngle: 0,
        expression: 'idle',
        grabbed: false,
      });
    }
  }

  public getFace(id: string) {
    return {
      identity: this.identities.get(id),
      state: this.faceStates.get(id),
    };
  }
}
