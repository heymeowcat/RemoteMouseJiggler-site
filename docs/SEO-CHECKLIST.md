# SEO checklist — Remote Mouse Jiggler

Site root: **https://heymeowcat.is-a.dev/RemoteMouseJiggler-site/**

---

## 0. Before deploying — required manual steps

### 0.1 Make the app repository public (blocking)

`github.com/heymeowcat/RemoteMouseJiggler` is currently **private**, so every
"View the source" button on the site, and the source links in the app
README, resolve to a 404. It also makes the site's "open source" and "MIT
licensed" claims unverifiable, which is a trust problem for a product whose
entire pitch is verifiability.

Fix it in one click: **Repository → Settings → Danger Zone → Change
visibility → Public.**

Do this before deploying the site.

### 0.2 Confirm the custom domain and base path

The site is published as a GitHub Pages project site under the
`heymeowcat.is-a.dev` custom domain, so it lives at
`/RemoteMouseJiggler-site/`. `site` and `base` in `astro.config.mjs` must
match that exactly. If the repository is renamed, update both, or the
canonical tags and sitemap will point at 404s.

### 0.3 Do not override `--site` in the deploy workflow

GitHub reports the Pages origin as `http://`, not `https://`. Passing
`--site` from the workflow silently produced an `http://` sitemap in a past
build. The workflow now only overrides `--base`; the origin comes from
`astro.config.mjs`.

---

## 1. What was wrong before this overhaul

These were live bugs, not opinions:

| Problem | Impact | Fix |
| --- | --- | --- |
| `astro.config.mjs` had `site: 'https://heymeowcat.is-a.dev'` with `base: '/RemoteMouseJiggler'` | The canonical domain and path did not match production. The published site actually lives at `/RemoteMouseJiggler-site/`. `https://heymeowcat.is-a.dev/RemoteMouseJiggler/` returned **404**. | `site` + `base` corrected to the real origin and path. |
| The deploy workflow passed `--site "${{ steps.pages.outputs.origin }}"` | GitHub returned the origin as `http://`, so the published sitemap listed every URL over plain HTTP. | The `--site` override was removed; the canonical origin comes from config. All sitemap URLs are now `https://`. |
| No canonical tags | Every page could be indexed under any URL it was requested from. | One absolute, `https://` canonical per page. |
| No robots.txt | — | Generated on every build, pointing at the sitemap. |
| No `og:image` sized for social | The 512×512 app icon was used as the share image and was cropped by every platform. | A dedicated 1200×630 share image. |
| No structured data | No rich results eligibility. | `SoftwareApplication`, `FAQPage`, `BreadcrumbList`, `WebPage`, `TechArticle`, `Organization`, `WebSite`. |
| Google Fonts loaded from a third party | A render-blocking third-party request on the critical path. | Removed entirely; the system font stack is used instead. |
| The jiggler simulator | A canvas animation loop running on every page load. | Removed. |
| Heading hierarchy skipped levels | FAQ questions were `<h4>` directly under an `<h2>`. | Fixed; the build audit now fails on skipped levels. |
| Multiple pages competed for the same terms | The home page was the only substantive page. | Ten pages, each with a distinct intent. |

---

## 2. On-page state

Checked automatically by `npm run build` → `scripts/audit-build.mjs`.

- [x] Exactly one `<h1>` per page
- [x] No skipped heading levels
- [x] Unique `<title>` and meta description on every page
- [x] Absolute `https://` canonical on every page
- [x] `robots` = `index, follow` on every content page (no `noindex`)
- [x] `og:image`, `og:title`, `og:description`, `og:url` on every page
- [x] Twitter card metadata on every page
- [x] `alt` text on every image
- [x] No broken internal links (verified against the built output)
- [x] `theme-color` for light and dark
- [x] Sitemap containing only canonical, indexable URLs
- [x] Legacy slugs (`/privacy-policy/`, `/terms-of-service/`) redirect to the new ones

### Lighthouse (home page, local production build)

| Category | Score |
| --- | --- |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

---

## 3. URL structure

All slugs are lowercase, hyphenated and permanent.

| URL | Purpose |
| --- | --- |
| `/` | Landing page. Brand and primary intent. |
| `/features/` | Complete feature reference. |
| `/jiggler-patterns/` | The eight movement patterns, compared. |
| `/bluetooth-hid/` | How the HID connection works. |
| `/faq/` | Full FAQ, `FAQPage` schema. |
| `/download/` | Install page with requirements. |
| `/changelog/` | Release history. |
| `/press/` | Press kit and linkable assets. |
| `/privacy/` | Privacy policy. |
| `/terms/` | Terms of service. |

Legacy `/privacy-policy/` and `/terms-of-service/` redirect to `/privacy/` and
`/terms/` respectively. They carry `noindex` because they are redirect stubs,
not duplicate content. If a hard 301 is preferred over a meta refresh, add a
`_redirects` file or a Cloudflare rule on the custom domain.

---

## 4. Search Console setup

### 4.1 Verify the property

1. Go to <https://search.google.com/search-console> and add a **Domain**
   property for `heymeowcat.is-a.dev`. DNS TXT verification is the only method
   that covers the whole domain and every subdomain path.
2. Alternatively add a **URL prefix** property for
   `https://heymeowcat.is-a.dev/RemoteMouseJiggler-site/`.

For the meta tag method, set the token in the build environment and rebuild:

```bash
PUBLIC_GOOGLE_SITE_VERIFICATION=your_token_here npm run build
```

The token is emitted as `<meta name="google-site-verification">` on every
page by `src/layouts/Layout.astro`.

For the HTML file method, drop `google-site-verification.html` into
`public/` and it will be published at
`/RemoteMouseJiggler-site/google-site-verification.html`.

### 4.2 Submit the sitemap

Submit this exact URL:

```
https://heymeowcat.is-a.dev/RemoteMouseJiggler-site/sitemap.xml
```

Check **Sitemaps** under *Sitemaps* in Search Console. It should report 10
URLs, all `https://`, all indexable.

> Note: the site is served under a sub-path of a domain that also hosts the
> developer's portfolio. The portfolio's own `robots.txt` lives at the domain
> root and allows crawling, so nothing blocks this section. If the portfolio's
> robots file ever changes to disallow the path, revisit this.

### 4.3 Request indexing

Use **URL Inspection** → *Request indexing* for:

1. `/` — the landing page
2. `/jiggler-patterns/` — the primary content target
3. `/features/`
4. `/faq/`
5. `/download/`
6. `/bluetooth-hid/`

Requesting the remaining four is optional.

### 4.4 Bing Webmaster Tools

Import from Search Console (one click), then submit the same sitemap URL.
Bing also supports a `msvalidate.01` meta tag using the same
`PUBLIC_GOOGLE_SITE_VERIFICATION` mechanism if you add a second variable.

---

## 5. Ongoing maintenance

- **Every release:** update `/changelog/`, update the version in
  `src/data/site.js`, and re-run `npm run build` so `lastmod` updates.
- **Monthly:** check Search Console for coverage errors and query gaps.
- **Quarterly:** refresh the FAQ with real support questions from the GitHub
  issues.
- **When the app changes:** update `src/data/content.js`. The site's copy is
  derived from the app source, and the audit will not catch a claim that
  drifts out of date — that check is manual by design.

---

## 6. Reproducing the checks

```bash
npm run build       # builds, generates sitemap.xml + robots.txt, then audits
npm run assets      # regenerates favicon, icons and og-image from app sources
```

`scripts/audit-build.mjs` fails the build on a missing h1, a skipped heading
level, a missing or non-https canonical, a `noindex` content page, a missing
alt attribute, or a broken internal link.
