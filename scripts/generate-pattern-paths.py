#!/usr/bin/env python3
"""
Generate the SVG path data for the eight mouse jiggler pattern previews.

This is a direct port of `patternPosition()` in the app:

    ui/screens/JigglerScreen.kt

The app draws each pattern card as three layers:
  1. a faint "ghost" guide path over the whole pattern
  2. a brighter trailing segment of the last 20% of the path
  3. a dot at the current position

We render the same three layers, frozen at one representative frame, so the
website shows the real geometry rather than an approximation.

Output: src/data/pattern-paths.json
"""

import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "data" / "pattern-paths.json"

# Preview canvas. r follows the app: min(height / 2.5, width / 3).
W, H = 120.0, 80.0
CX, CY = W / 2, H / 2
R = min(H / 2.5, W / 3)

GUIDE_STEPS = 60
TRAIL_STEPS = 20

# Frame each pattern is frozen at, chosen to match the app's own previews.
DOT_T = {
    "jitter": 0.25,
    "circle": 0.064,
    "figure-eight": 0.30,
    "random": 0.45,
    "wave": 0.40,
    "spiral": 0.18,
    "diagonal": 0.25,
    "coding": 0.05,
}


def position(pattern, t):
    angle = t * 2 * math.pi

    if pattern == "jitter":
        x = CX - R * 0.5 if t < 0.5 else CX + R * 0.5
        return x, CY

    if pattern == "circle":
        return CX + R * math.cos(angle), CY + R * math.sin(angle)

    if pattern == "figure-eight":
        return CX + R * math.sin(angle), CY + R * math.sin(2 * angle) / 2

    if pattern == "random":
        squiggle = R * 0.4 * math.sin(angle * 5)
        return CX + R * 0.8 * (t * 2 - 1), CY + squiggle

    if pattern == "wave":
        return CX + R * (t * 2 - 1), CY + R * 0.5 * math.sin(angle * 2)

    if pattern == "spiral":
        spiral_r = R * t
        return CX + spiral_r * math.cos(angle * 3), CY + spiral_r * math.sin(angle * 3)

    if pattern == "diagonal":
        phase = t * 2 if t < 0.5 else (1 - t) * 2
        return CX - R + R * 2 * phase, CY - R + R * 2 * phase

    if pattern == "coding":
        fraction = (t * 5) % 1
        x = CX - R * 0.7 + R * 1.4 * fraction
        y = CY + R * 0.8 * math.sin(t * math.pi * 2) * 0.4
        return x, y

    raise ValueError(f"unknown pattern: {pattern}")


def build(pattern, from_t, to_t, steps):
    """Polyline path data for the pattern between two points in time."""
    points = []
    for i in range(steps + 1):
        t = from_t + (to_t - from_t) * (i / steps)
        points.append(position(pattern, t))

    parts = [f"M{points[0][0]:.2f} {points[0][1]:.2f}"]
    for x, y in points[1:]:
        parts.append(f"L{x:.2f} {y:.2f}")
    return "".join(parts)


ORDER = [
    "jitter",
    "circle",
    "figure-eight",
    "random",
    "wave",
    "spiral",
    "diagonal",
    "coding",
]

result = {}

for name in ORDER:
    t = DOT_T[name]
    trail_start = max(t - 0.2, 0.0)
    dx, dy = position(name, t)
    result[name] = {
        "guide": build(name, 0.0, 1.0, GUIDE_STEPS),
        "trail": build(name, trail_start, t, TRAIL_STEPS),
        "dot": [round(dx, 2), round(dy, 2)],
    }

OUT.write_text(json.dumps(result, indent=4) + "\n")
print(f"Wrote {len(result)} pattern paths to {OUT.relative_to(ROOT)}")
