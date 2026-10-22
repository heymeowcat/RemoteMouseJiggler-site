#!/usr/bin/env node
/**
 * Contrast guard.
 *
 * Parses the design tokens out of global.css and checks every foreground /
 * background pair the site actually uses against WCAG 2.1 AA.
 *
 * This exists because a real bug slipped through: in the dark theme the brand
 * colour is light, so the primary button was white-on-light-purple at 2.7:1.
 * Lighthouse only caught it when the audit happened to run in dark mode, and
 * it is not something a static HTML audit can see. A token level check runs
 * on every build and always covers both themes.
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const css = await readFile(join(root, "src", "styles", "global.css"), "utf8");

/* ----------------------------------------------------------------- parse -- */

/**
 * Pull the custom properties out of every block with the given selector.
 * A selector can appear more than once (the app preview palette lives in its
 * own :root block), so all matching blocks are merged.
 */
function tokensFor(selector) {
    const tokens = {};
    let from = 0;
    let found = false;

    for (;;) {
        const index = css.indexOf(selector, from);
        if (index === -1) break;

        // Make sure this is a real selector, not part of a longer one.
        const before = css[index - 1] ?? " ";
        if (!/[\s{]/.test(before)) {
            from = index + selector.length;
            continue;
        }

        const open = css.indexOf("{", index);
        if (open === -1) break;

        let depth = 0;
        let end = open;
        for (let i = open; i < css.length; i++) {
            if (css[i] === "{") depth++;
            else if (css[i] === "}") {
                depth--;
                if (depth === 0) {
                    end = i;
                    break;
                }
            }
        }

        const block = css.slice(open + 1, end);
        for (const match of block.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
            tokens[match[1]] = match[2].trim();
        }

        found = true;
        from = end;
    }

    if (!found) throw new Error(`Selector not found in global.css: ${selector}`);
    return tokens;
}

const light = tokensFor(":root {");
const dark = tokensFor('[data-theme="dark"] {');

/* -------------------------------------------------------------- contrast -- */

function toRgb(value) {
    const hex = value.trim().replace("#", "");
    const full =
        hex.length === 3
            ? hex
                  .split("")
                  .map((c) => c + c)
                  .join("")
            : hex;
    return [
        parseInt(full.slice(0, 2), 16),
        parseInt(full.slice(2, 4), 16),
        parseInt(full.slice(4, 6), 16),
    ];
}

function luminance(rgb) {
    const [r, g, b] = rgb.map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg, bg) {
    const a = luminance(toRgb(fg));
    const b = luminance(toRgb(bg));
    const [light, dark] = a > b ? [a, b] : [b, a];
    return (light + 0.05) / (dark + 0.05);
}

/* ------------------------------------------------------------------ pairs -- */

/**
 * Every foreground / background token pair that appears in the styles.
 * The minimum is 4.5 for body text; 3.0 is only used where the pair is a
 * large heading or a non-text indicator.
 */
const PAIRS = [
    ["ink", "bg", 4.5],
    ["ink-2", "bg", 4.5],
    ["ink-3", "bg", 4.5],
    ["ink", "surface", 4.5],
    ["ink-2", "surface", 4.5],
    ["ink-3", "surface", 4.5],
    ["ink", "surface-2", 4.5],
    ["ink-2", "surface-2", 4.5],
    ["ink-3", "surface-2", 4.5],
    ["ink-2", "surface-3", 4.5],

    ["brand", "bg", 4.5],
    ["brand", "surface", 4.5],
    ["brand", "brand-soft", 4.5],
    ["brand", "brand-soft-2", 4.5],
    ["on-brand", "brand", 4.5],
    ["on-brand", "brand-strong", 4.5],

    ["on-accent", "accent", 4.5],
    ["on-accent-soft", "accent-soft", 4.5],

    ["ok", "ok-soft", 4.5],

    // App preview palette
    ["pv-ink", "pv-bg", 4.5],
    ["pv-ink", "pv-surface", 4.5],
    ["pv-ink", "pv-selected", 4.5],
    ["pv-ink-2", "pv-bg", 4.5],
    ["pv-ink-2", "pv-surface", 4.5],
    ["pv-ink-2", "pv-selected", 4.5],
    ["pv-accent", "pv-bg", 4.5],
    ["pv-accent", "pv-surface", 4.5],
    ["pv-accent", "pv-surface-2", 4.5],
    ["pv-on-accent", "pv-accent", 4.5],
];

const THEMES = [
    ["light", light],
    ["dark", dark],
];

const failures = [];

for (const [theme, tokens] of THEMES) {
    for (const [fg, bg, min] of PAIRS) {
        const fgValue = tokens[fg];
        const bgValue = tokens[bg];
        if (!fgValue || !bgValue) {
            failures.push(`${theme}: missing token --${!fgValue ? fg : bg}`);
            continue;
        }
        const ratio = contrast(fgValue, bgValue);
        if (ratio < min) {
            failures.push(
                `${theme}: --${fg} on --${bg} is ${ratio.toFixed(2)}:1, needs ${min}:1 ` +
                    `(${fgValue} on ${bgValue})`,
            );
        }
    }
}

if (failures.length) {
    console.error(`\n✗ ${failures.length} contrast failure(s):\n`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
}

console.log(
    `✓ Contrast passed: ${PAIRS.length} token pairs checked in both themes (WCAG AA).`,
);
