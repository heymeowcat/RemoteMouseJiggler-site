#!/usr/bin/env node
/**
 * Post-build audit. Checks the generated HTML for the things that quietly
 * break SEO and accessibility:
 *
 *   - exactly one <h1> per page
 *   - heading levels never skip a level
 *   - a canonical link on every page, absolute and https
 *   - no noindex on a content page
 *   - every image has alt text
 *   - every internal link resolves to a page that was actually built
 *   - every page has a title and a meta description
 */

import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { SITE_BASE } from "../astro.config.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");

/**
 * The canonical base path. The deploy workflow passes SITE_BASE so the audit
 * checks the links exactly as they are published.
 */
const base = (process.env.SITE_BASE || SITE_BASE).replace(/\/$/, "");

async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) files.push(...(await walk(full)));
        else files.push(full);
    }
    return files;
}

const htmlFiles = (await walk(dist)).filter((f) => f.endsWith(".html"));

const problems = [];
const builtRoutes = new Set();

for (const file of htmlFiles) {
    const rel = relative(dist, file).split(sep).join("/");
    const route = rel === "index.html" ? "/" : `/${rel.replace(/index\.html$/, "")}`;
    builtRoutes.add(route);
}

/** Map a built route to its HTML file. */
const routeToFile = new Map();
for (const file of htmlFiles) {
    const rel = relative(dist, file).split(sep).join("/");
    const route = rel === "index.html" ? "/" : `/${rel.replace(/index\.html$/, "")}`;
    routeToFile.set(route, file);
}

for (const [route, file] of routeToFile) {
    const html = await readFile(file, "utf8");
    const isRedirect = /http-equiv=["']refresh["']/i.test(html);
    const label = route;

    if (isRedirect) {
        // Redirect stubs must not be indexed and must not be in the sitemap.
        if (!/name=["']robots["'][^>]*noindex/i.test(html)) {
            problems.push(`${label}: redirect stub is missing a noindex robots tag`);
        }
        continue;
    }

    // --- h1 ------------------------------------------------------------
    const h1s = html.match(/<h1\b/gi) ?? [];
    if (h1s.length !== 1) {
        problems.push(`${label}: expected exactly 1 <h1>, found ${h1s.length}`);
    }

    // --- heading order -------------------------------------------------
    const headings = [...html.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
    let previous = 0;
    for (const level of headings) {
        if (previous && level > previous + 1) {
            problems.push(`${label}: heading jumps from h${previous} to h${level}`);
        }
        previous = level;
    }

    // --- canonical -----------------------------------------------------
    const canonical = html.match(
        /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i,
    );
    if (!canonical) {
        problems.push(`${label}: missing canonical link`);
    } else if (!canonical[1].startsWith("https://")) {
        problems.push(`${label}: canonical is not https (${canonical[1]})`);
    }

    // --- robots --------------------------------------------------------
    const robots = html.match(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+)["']/i);
    if (!robots) {
        problems.push(`${label}: missing robots meta tag`);
    } else if (/noindex/i.test(robots[1])) {
        problems.push(`${label}: content page is marked noindex`);
    }

    // --- title + description -------------------------------------------
    const title = html.match(/<title>([^<]*)<\/title>/i);
    if (!title || !title[1].trim()) problems.push(`${label}: missing title`);
    const description = html.match(
        /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i,
    );
    if (!description || !description[1].trim()) {
        problems.push(`${label}: missing meta description`);
    }

    // --- og:image ------------------------------------------------------
    if (!/property=["']og:image["']/i.test(html)) {
        problems.push(`${label}: missing og:image`);
    }

    // --- images have alt -----------------------------------------------
    for (const img of html.matchAll(/<img\b[^>]*>/gi)) {
        if (!/\balt=/i.test(img[0])) {
            problems.push(`${label}: <img> without alt attribute: ${img[0].slice(0, 90)}`);
        }
    }

    // --- internal links resolve ----------------------------------------
    for (const link of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
        const href = link[1];
        if (/^(https?:|mailto:|tel:|#)/i.test(href)) continue;
        const [pathPart] = href.split("#");
        if (!pathPart) continue;

        let target = pathPart;
        if (target.startsWith(base)) target = target.slice(base.length);
        if (!target.startsWith("/")) continue;

        const asRoute = target.endsWith("/") ? target : `${target}/`;
        if (builtRoutes.has(asRoute)) continue;

        // Not a page. Check that the file it points at was actually published.
        const asFile = join(dist, target.replace(/^\//, ""));
        const asIndex = join(dist, target.replace(/^\//, ""), "index.html");
        if (!existsSync(asFile) && !existsSync(asIndex)) {
            problems.push(`${label}: broken internal link -> ${href}`);
        }
    }
}

if (problems.length) {
    console.error(`\n✗ ${problems.length} issue(s) found:\n`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
}

console.log(`✓ Audit passed: ${routeToFile.size} pages checked, no issues found.`);
