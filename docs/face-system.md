# FACE SYSTEM SPECIFICATION — The Screen Weasels

The Screen Weasel faces are stylized, geometric, 2D entities residing in the pure black void (`#000000`).

---

## 1. Geometric Ingredients

1. **Eyes**:
   * Symmetrical or asymmetrical almond, circular, or slanted capsule contours.
   * Internal pupils that track gaze coordinates `(gazeX, gazeY)` in $[-1.0, 1.0]$.
   * Smooth blink transitions: vertical eyelid compression.
2. **Brows**:
   * Slanted geometric bars or polygonal wedges.
   * Angle indicates internal arousal: downward V (aggression/scowl), upward arch (curiosity/surprise).
3. **Nose**:
   * Sharp inverted triangle, diamond, or subtle colored dot accent.
4. **Mouth & Teeth**:
   * Expressive polygonal arc or pill shape.
   * Openness metric `mouthOpen` in $[0.0, 1.0]$.
   * Teeth styling: sharp jagged serrations, flat blunt blocks, or toothless grin.
5. **Cheeks**:
   * Dual circular blush dots, parallel dash lines, or subtle geometric markings.

---

## 2. The Nine Identities (Target Cast)

| ID | Name | Primary Color | Accent Color | Signature Feature | Trait Bias |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `weasel_01` | Grin-Green | `#10B981` (Emerald) | `#F97316` (Orange) | Sharp teeth, orange nose | Mischievous, quick gaze |
| `weasel_02` | Cobalt-Stare| `#3B82F6` (Blue) | `#FBBF24` (Amber) | Large circular unblinking eyes | Curious watcher |
| `weasel_03` | Crimson-Snarl|`#EF4444` (Red) | `#FFFFFF` (White) | Heavy slanted brows, serrated jaw| Easily startled/aggressive |
| `weasel_04` | Violet-Slink| `#8B5CF6` (Purple) | `#34D399` (Mint) | Slanted almond eyes, no nose | Cautious, avoids Hand |
| `weasel_05` | Amber-Snap | `#F59E0B` (Amber) | `#EC4899` (Pink) | Asymmetrical eyes, wide grin | Energetic, bounce bias |
| `weasel_06` | Cyan-Ghost | `#06B6D4` (Cyan) | `#64748B` (Slate) | Single center tooth, flat brows | Stiff, slow reaction |
| `weasel_07` | Rose-Flicker| `#F43F5E` (Rose) | `#A855F7` (Purple) | Double-dash cheek marks | Rhythmic, music-reactive |
| `weasel_08` | Gold-Mask | `#EAB308` (Gold) | `#1E293B` (Navy) | Heavy angular brow bar | Dominant, territory holder|
| `weasel_09` | Slate-Prowl| `#94A3B8` (Slate) | `#E2E8F0` (Silver)| Narrow squinting eyes | Skittish lurker |

---

## 3. Autonomous Behaviors

* **Gaze Drift**: Periodic smooth target shifts every 1.5–4.0 seconds.
* **Micro-Blinks**: Natural asymmetrical blinking every 3–8 seconds.
* **Proximity Reaction**: When two faces come within 50 pixels, brows subtly shift toward suspicion or curiosity.
* **Hand Reaction**:
  * $v > 30 \text{ px/s}$: Startle recoil (mouth opens, brows shoot up, pupils dilate).
  * $v < 10 \text{ px/s}$: Slow curiosity (gaze smoothly locks on Hand, slight neck lean).
