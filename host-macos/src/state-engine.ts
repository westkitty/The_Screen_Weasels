import { familiarSignalFromTouch, resolveFamiliarSignal, type FamiliarSignal, type FaceIdentity, type FaceState, type SyncedFace } from '@screen-weasels/protocol';

/**
 * WorldStateEngine maintains authoritative world state on the Mac host.
 *
 * NOTE: The identities below are PROVISIONAL SIMULATOR / TEST FIXTURES used for
 * development and testing. They are NOT the final canonical target cast.
 * Andrew has not yet canonically named or finalized the 9 permanent identities.
 *
 * The green face with orange accents (fixture_weasel_01) represents the established
 * visual anchor from discovery.
 */
export class WorldStateEngine {
  public identities: Map<string, FaceIdentity> = new Map();
  public faceStates: Map<string, FaceState> = new Map();
  private touchSeries = new Map<string, { count: number; at: number }>();
  private familiarSequence = 0;

  constructor() {
    this.seedProvisionalFixtures();
  }

  private seedProvisionalFixtures() {
    const list: FaceIdentity[] = [
      { id: 'fixture_weasel_01', name: 'Fixture-Green-Orange', primaryColor: '#10B981', accentColor: '#F97316', eyeShape: 'almond', toothType: 'sharp', traitSeed: 101 },
      { id: 'fixture_weasel_02', name: 'Fixture-Blue-Amber', primaryColor: '#3B82F6', accentColor: '#FBBF24', eyeShape: 'circular', toothType: 'none', traitSeed: 102 },
      { id: 'fixture_weasel_03', name: 'Fixture-Red-White', primaryColor: '#EF4444', accentColor: '#FFFFFF', eyeShape: 'slanted', toothType: 'sharp', traitSeed: 103 },
      { id: 'fixture_weasel_04', name: 'Fixture-Purple-Mint', primaryColor: '#8B5CF6', accentColor: '#34D399', eyeShape: 'squint', toothType: 'none', traitSeed: 104 },
      { id: 'fixture_weasel_05', name: 'Fixture-Amber-Pink', primaryColor: '#F59E0B', accentColor: '#EC4899', eyeShape: 'circular', toothType: 'blunt', traitSeed: 105 },
      { id: 'fixture_weasel_06', name: 'Fixture-Cyan-Slate', primaryColor: '#06B6D4', accentColor: '#64748B', eyeShape: 'almond', toothType: 'blunt', traitSeed: 106 },
      { id: 'fixture_weasel_07', name: 'Fixture-Rose-Purple', primaryColor: '#F43F5E', accentColor: '#A855F7', eyeShape: 'slanted', toothType: 'none', traitSeed: 107 },
      { id: 'fixture_weasel_08', name: 'Fixture-Gold-Navy', primaryColor: '#EAB308', accentColor: '#1E293B', eyeShape: 'squint', toothType: 'sharp', traitSeed: 108 },
      { id: 'fixture_weasel_09', name: 'Fixture-Slate-Silver', primaryColor: '#94A3B8', accentColor: '#E2E8F0', eyeShape: 'almond', toothType: 'none', traitSeed: 109 },
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

  public applyFamiliarSignal(signal: FamiliarSignal): FamiliarSignal | null {
    const state = this.faceStates.get(signal.entityId);
    if (!state) return null;

    const resolved = resolveFamiliarSignal(state.familiar, signal, signal.timestamp);
    state.familiar = resolved;


    switch (resolved.reaction) {
      case 'startled':
        state.expression = 'startled';
        state.mouthOpen = Math.max(state.mouthOpen, 0.9 * resolved.intensity);
        break;
      case 'curious':
        state.expression = 'curious';
        state.mouthOpen = Math.max(state.mouthOpen, 0.2 * resolved.intensity);
        break;
      case 'irritated':
      case 'warning':
        state.expression = 'suspicious';
        state.browAngle = 8 * resolved.intensity;
        break;
      case 'dizzy':
      case 'error':
        state.expression = 'struggling';
        state.mouthOpen = Math.max(state.mouthOpen, 0.5 * resolved.intensity);
        break;
      case 'pleased':
      case 'celebrate':
        state.expression = 'idle';
        state.mouthOpen = Math.max(state.mouthOpen, 0.35 * resolved.intensity);
        break;
      case 'sleepy':
        state.expression = 'idle';
        state.mouthOpen = 0.05;
        break;
      default:
        break;
    }

    return resolved;
  }

  public registerTouch(entityId: string, now = Date.now()): FamiliarSignal | null {
    const previous = this.touchSeries.get(entityId) ?? { count: 0, at: 0 };
    const count = now - previous.at < 1600 ? previous.count + 1 : 1;
    this.touchSeries.set(entityId, {
      count: count >= 4 ? 0 : count,
      at: now,
    });

    const signal = familiarSignalFromTouch(
      entityId,
      ++this.familiarSequence,
      count,
      now,
    );

    return this.applyFamiliarSignal(signal);
  }

  public nextFamiliarSequence(): number {
    return ++this.familiarSequence;
  }

  public getFace(id: string): SyncedFace | null {
    const identity = this.identities.get(id);
    const state = this.faceStates.get(id);
    if (!identity || !state) return null;
    return { identity, state };
  }

  public getAllFaces(): SyncedFace[] {
    const result: SyncedFace[] = [];
    for (const [id, identity] of this.identities.entries()) {
      const state = this.faceStates.get(id)!;
      result.push({ identity, state });
    }
    return result;
  }
}
