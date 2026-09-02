#!/usr/bin/env node
/**
 * Post-build step: writes dist/sitemap.xml and dist/robots.txt.
 *
 * The sitemap is generated from the files that actually landed in dist/, so it
 * can never drift from the real routes. Redirect stubs are excluded, and every
 * URL is absolute https against the canonical origin.
 */

import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

import { SITE_BASE, SITE_ORIGIN } from "../astro.config.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");

/** Route priority and change frequency, keyed by the path after the base. */
const ROUTE_META = {
    "/": { priority: "1.0", changefreq: "weekly" },
    "/features/": { priority: "0.9", changefreq: "monthly" },
    "/jiggler-patterns/": { priority: "0.9", changefreq: "monthly" },
    "/faq/": { priority: "0.8", changefreq: "monthly" },
    "/bluetooth-hid/": { priority: "0.7", changefreq: "yearly" },
    "/download/": { priority: "0.8", changefreq: "monthly" },
    "/press/": { priority: "0.5", changefreq: "yearly" },
    "/changelog/": { priority: "0.5", changefreq: "weekly" },
    "/privacy/": { priority: "0.3", changefreq: "yearly" },
    "/terms/": { priority: "0.3", changefreq: "yearly" },
};

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

/** Last modification date for a source file, preferring the git commit date. */
function lastModified(sourceFile) {
    if (sourceFile && existsSync(sourceFile)) {
        try {
            const date = execFileSync(
                "git",
                ["log", "-1", "--format=%cI", "--", sourceFile],
                { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
            ).trim();
            if (date) return date.slice(0, 10);
        } catch {
            /* not a git checkout, fall through */
        }
    }
    return null;
}

function sourceFor(route) {
    const slug = route === "/" ? "index" : route.replace(/^\/|\/$/g, "");
    return join(root, "src", "pages", `${slug}.astro`);
}

const origin = SITE_ORIGIN.replace(/\/$/, "");

/**
 * The canonical base path.
 *
 * The deploy workflow passes SITE_BASE so the sitemap always matches the
 * path GitHub Pages actually serves, even if the repository is renamed.
 * Locally it falls back to the value in astro.config.mjs.
 */
const base = (process.env.SITE_BASE || SITE_BASE).replace(/\/$/, "");

const htmlFiles = (await walk(dist)).filter((file) => file.endsWith(".html"));

const routes = [];

for (const file of htmlFiles) {
    const rel = relative(dist, file).split(sep).join("/");
    const html = await readFile(file, "utf8");

    // Astro writes redirect stubs with a meta refresh. They are not content
    // pages and must stay out of the sitemap.
    if (/http-equiv=["']refresh["']/i.test(html)) continue;

    const route = rel === "index.html" ? "/" : `/${rel.replace(/index\.html$/, "")}`;
    routes.push(route);
}

routes.sort((a, b) => {
    if (a === "/") return -1;
    if (b === "/") return 1;
    return a.localeCompare(b);
});

const today = new Date().toISOString().slice(0, 10);

const urls = routes
    .map((route) => {
        const meta = ROUTE_META[route] ?? { priority: "0.5", changefreq: "monthly" };
        const loc = `${origin}${base}${route}`;
        const lastmod = lastModified(sourceFor(route)) ?? today;
        return [
            "    <url>",
            `        <loc>${loc}</loc>`,
            `        <lastmod>${lastmod}</lastmod>`,
            `        <changefreq>${meta.changefreq}</changefreq>`,
            `        <priority>${meta.priority}</priority>`,
            "    </url>",
        ].join("\n");
    })
    .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await writeFile(join(dist, "sitemap.xml"), sitemap, "utf8");

const robots = `User-agent: *
Allow: /

Sitemap: ${origin}${base}/sitemap.xml
`;

await writeFile(join(dist, "robots.txt"), robots, "utf8");

console.log(`Sitemap written with ${routes.length} URLs -> ${origin}${base}/sitemap.xml`);
