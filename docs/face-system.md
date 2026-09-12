# FACE SYSTEM SPECIFICATION — The Screen Weasels

The Screen Weasel faces are stylized, geometric, 2D entities residing in the pure black void (`#000000`).

---

## 1. Geometric Ingredients

1. **Eyes**:
   * Symmetrical or asymmetrical almond, circular, or slanted capsule contours.
   * Internal pupils that track gaze coordinates `(gazeX, gazeY)` in $[-1.0, 1.0]$.
   * **Startle Dilation**: High Hand velocity ($v > 350\text{ px/s}$) expands pupil radius by $1.6\times$ and enlarges eye contours.
2. **Brows**:
   * Slanted geometric bars or polygonal wedges.
   * Angle indicates internal arousal: downward V (scowl), upward arch (curiosity/surprise).
3. **Nose**:
   * Sharp inverted triangle, diamond, or subtle colored dot accent.
4. **Mouth & Teeth**:
   * Expressive polygonal arc or pill shape with dynamic openness metric in $[0.0, 1.0]$.
   * Teeth styling: sharp jagged serrations, flat blunt blocks, or toothless grin.
5. **Cheeks**:
   * Dual circular blush dots, parallel dash lines, or subtle geometric markings.

---

## 2. Established Visual Anchor vs. Provisional Test Fixtures

> **CRITICAL NOTE**: Andrew has NOT yet canonically chosen the final 9 names, palettes, or personality traits for the permanent cast. The table below represents **PROVISIONAL DEVELOPMENT FIXTURES** used for simulator and protocol testing.
> 
> The sole visual anchor established from discovery is a **green face with an orange nose/accents and sharp teeth**, represented below by `fixture_weasel_01`.

| Stable Fixture ID | Visual Anchor / Description | Primary Color | Accent Color | Feature Style |
| :--- | :--- | :--- | :--- | :--- |
| `fixture_weasel_01`| **Established Discovery Anchor** | `#10B981` (Green) | `#F97316` (Orange) | Almond eyes, sharp teeth, orange nose |
| `fixture_weasel_02`| Provisional Test Fixture 02 | `#3B82F6` (Blue) | `#FBBF24` (Amber) | Large circular eyes, toothless |
| `fixture_weasel_03`| Provisional Test Fixture 03 | `#EF4444` (Red) | `#FFFFFF` (White) | Slanted eyes, sharp teeth, heavy brows |
| `fixture_weasel_04`| Provisional Test Fixture 04 | `#8B5CF6` (Purple) | `#34D399` (Mint) | Squinting almond eyes, toothless |
| `fixture_weasel_05`| Provisional Test Fixture 05 | `#F59E0B` (Amber) | `#EC4899` (Pink) | Circular eyes, blunt block teeth |
| `fixture_weasel_06`| Provisional Test Fixture 06 | `#06B6D4` (Cyan) | `#64748B` (Slate) | Almond eyes, blunt center tooth |
| `fixture_weasel_07`| Provisional Test Fixture 07 | `#F43F5E` (Rose) | `#A855F7` (Purple) | Slanted eyes, double-dash cheek marks |
| `fixture_weasel_08`| Provisional Test Fixture 08 | `#EAB308` (Gold) | `#1E293B` (Navy) | Squinting eyes, sharp teeth |
| `fixture_weasel_09`| Provisional Test Fixture 09 | `#94A3B8` (Slate) | `#E2E8F0` (Silver)| Almond eyes, toothless |

---

## 3. Autonomous & Kinematic Behaviors

* **Time-Based Gaze Scheduling**: In idle mode, gaze targets shift every 1.5–3.5 seconds of real elapsed time, with smooth continuous interpolation (no frame-rate-dependent instantaneous hopping).
* **Hand Reaction States**:
  * **Fast Sweep ($v > 350\text{ px/s}$)**: Immediate startle response — pupils dilate $1.6\times$, brows raise, mouth drops open.
  * **Slow Approach ($30 < v \le 350\text{ px/s}$)**: Curious gaze tracking with slight mouth parting.
  * **Stationary / Dwelling ($v \le 25\text{ px/s}$ for $> 0.6\text{s}$)**: Entity settles into calm watchful observation.
