# Familiar Bus — Screen Weasels Adapter

## Purpose

Familiar Bus is a renderer-neutral semantic layer for attention and reaction. It does not define personality, canon, dialogue, art direction, or rendering technology.

Screen Weasels consumes the contract while preserving its existing continuous gaze, procedural face renderer, Hand portal, and host-authoritative world state.

## Semantic contract

A Familiar signal carries:

- `entityId`: target identity.
- `source`: subsystem that emitted the signal.
- `attention`: `idle | aware | focused | interrupted | urgent`.
- `reaction`: optional semantic reaction such as `curious`, `startled`, `irritated`, `dizzy`, `warning`, or `error`.
- `intensity`: normalized 0..1 strength.
- `look`: optional renderer-neutral normalized target. Screen Weasels does not let this replace its existing continuous gaze equations.
- `trigger`: `pointer | touch | audio | system | agent | timer | world`.
- `priority`: optional 0..100 arbitration priority.
- `durationMs`: optional TTL.
- `timestamp` and `sequence`: deterministic ordering.

## Arbitration

The current active signal remains until one of these conditions is true:

1. its TTL expires;
2. a higher-priority signal arrives;
3. equal priority is broken by sequence;
4. equal sequence is broken by timestamp.

This makes short reactions deterministic without creating personality logic.

## Screen Weasels mapping

Current adapter behavior:

| Input | Semantic result |
|---|---|
| Hand inactive | idle / neutral |
| Hand speed > 350 px/s | interrupted / startled |
| Hand speed > 30 px/s | focused / curious |
| first touch | aware / blink |
| second rapid touch | aware / pleased |
| third rapid touch | aware / irritated |
| fourth rapid touch | interrupted / dizzy |

The host is authoritative for semantic arbitration. The simulator and firmware interpret the resolved state using their native renderers.

## Protected boundaries

- Continuous `gazeX/gazeY` remains authoritative.
- Existing `HAND_UPDATE` remains intact.
- Existing `FACE_SYNC` remains backward-compatible; `state.familiar` is optional.
- Firmware receives semantic state but does not run React or a browser runtime.
- Familiar Bus never names or defines the final Screen Weasel cast.
- Familiar Bus does not decide dialogue, motives, personality, or canon.

## Protocol addition

Protocol 1.1 adds `FAMILIAR_SIGNAL`.

Example:

```json
{
  "type": "FAMILIAR_SIGNAL",
  "seq": 84,
  "timestamp": 1789682400000,
  "payload": {
    "entityId": "fixture_weasel_01",
    "source": "screen-weasels.touch",
    "attention": "interrupted",
    "reaction": "dizzy",
    "intensity": 0.97,
    "trigger": "touch",
    "priority": 70,
    "durationMs": 1200,
    "timestamp": 1789682400000,
    "sequence": 19
  }
}
```

## Validation status

Source integration is implemented on `feature/familiar-bus-foundation`. Protocol tests, TypeScript builds, simulator runtime, firmware compilation, and physical-CYD behavior remain unverified until an execution node is available.
