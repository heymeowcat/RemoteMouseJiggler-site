// @ts-check
import { defineConfig } from "astro/config";

// Canonical origin. The site is published through GitHub Pages under the
// `heymeowcat.is-a.dev` custom domain, so every absolute URL must use https
// and this exact origin (no trailing slash).
export const SITE_ORIGIN = "https://heymeowcat.is-a.dev";

// Sub-path the project is served from (GitHub Pages project site).
export const SITE_BASE = "/RemoteMouseJiggler-site";

// https://astro.build/config
export default defineConfig({
    site: SITE_ORIGIN,
    base: SITE_BASE,
    trailingSlash: "always",
    compressHTML: true,

    build: {
        // The whole stylesheet is only a few KB gzipped, so inlining it removes
        // a render-blocking round trip entirely. That is a straight win for
        // first paint on a site this small.
        inlineStylesheets: "always",
        assets: "_assets",
    },

    // Viewport-limited prefetch keeps navigation snappy without shipping a
    // heavy client runtime.
    prefetch: {
        prefetchAll: true,
        defaultStrategy: "viewport",
    },

    // Legacy slugs from the previous build. Kept so existing links and any
    // inbound backlinks continue to resolve instead of 404-ing.
    // The targets must carry the base path explicitly, otherwise the generated
    // redirect points outside the site.
    redirects: {
        "/privacy-policy": `${SITE_BASE}/privacy/`,
        "/terms-of-service": `${SITE_BASE}/terms/`,
    },
});
