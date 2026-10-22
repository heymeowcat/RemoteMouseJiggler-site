# Remote Mouse Jiggler — Website

Marketing site, feature reference, press kit, privacy policy and terms for the
**Remote Mouse Jiggler** Android app.

> **Live site:** <https://heymeowcat.is-a.dev/RemoteMouseJiggler-site/>
>
> **App:** [Google Play](https://play.google.com/store/apps/details?id=com.heymeowcat.remotemousejiggler)

Turn an Android phone into a Bluetooth mouse, trackpad, keyboard and automated
mouse jiggler. No software on the machine you are controlling, no internet
permission on your phone.

## Pages

| URL | Purpose |
| --- | --- |
| `/` | Landing page |
| `/features/` | Complete feature reference |
| `/jiggler-patterns/` | The eight movement patterns, compared |
| `/bluetooth-hid/` | How the Bluetooth HID connection works |
| `/faq/` | Full FAQ (`FAQPage` schema) |
| `/download/` | Install page and requirements |
| `/changelog/` | Release history |
| `/press/` | Press kit, brand assets, boilerplate |
| `/privacy/` | Privacy policy |
| `/terms/` | Terms of service |

## Stack

Astro 5, static output, zero client framework. The only JavaScript on the
page is a ~1 KB prefetch bundle plus a small inline script that applies the
saved colour theme before first paint.

```
src/
  assets/logo.png        app icon, optimised at build time via astro:assets
  components/            AppPreview, Brand, Header, Footer, PageHero,
                         PatternPreview, PlayBadge, ThemeToggle
  data/site.js           brand, URLs and metadata
  data/content.js        all product copy, written from the app source
  data/pattern-paths.json  jiggle pattern geometry, generated from the app
  layouts/Layout.astro   document head, SEO, structured data
  pages/                 one file per route
  styles/global.css      design tokens and base styles
scripts/
  generate-assets.py       rebuilds favicon, icons and og-image from the app repo
  generate-pattern-paths.py  rebuilds the pattern previews from the app's maths
  generate-sitemap.mjs     writes dist/sitemap.xml and dist/robots.txt
  audit-build.mjs          post-build SEO and accessibility audit
  check-contrast.mjs       WCAG AA token check across both themes
docs/
  SEO-CHECKLIST.md       on-page state and Search Console setup
  BACKLINK-STRATEGY.md   link building plan
```

## Interface previews

The pattern previews are **generated from the app's own maths**, not drawn by
hand. `scripts/generate-pattern-paths.py` is a direct port of
`patternPosition()` in the app's `ui/screens/JigglerScreen.kt`, so the paths
on the website are the real trajectories. The hero shows a picture of the
app's actual Mouse Jiggler screen, built with the app's own Material 3 light
and dark colour schemes.

## Commands

```bash
npm install
npm run dev           # local dev server
npm run build         # build + sitemap + robots.txt + audit + contrast check
npm run preview       # serve the production build
npm run assets        # regenerate brand assets from the app repository
npm run pattern-paths # regenerate the pattern previews from the app
npm run audit         # structural and SEO audit only
npm run contrast      # WCAG AA token check only
```

`npm run build` runs two guards last. `audit-build.mjs` fails the build on a
missing or duplicated `<h1>`, a skipped heading level, a missing or non-HTTPS
canonical, a `noindex` content page, an image without `alt`, or a broken
internal link. `check-contrast.mjs` fails the build if any of the 29 token
pairs drops below WCAG AA in either theme.

## Brand

| Colour | Hex | Source |
| --- | --- | --- |
| Brand blue | `#3F19BC` | App icon background |
| Duck yellow | `#FFB700` | App icon artwork |

The "Get it on Google Play" button is Google's own vector badge, self-hosted
from `public/google-play-badge.svg` so it loads with the rest of the site and
adds no third-party request.

## Deployment

GitHub Actions (`.github/workflows/astro.yml`) builds and publishes to GitHub
Pages under the `heymeowcat.is-a.dev` custom domain. The canonical origin and
base path live in `astro.config.mjs`; do not override `--site` in the
workflow, because GitHub reports the origin as `http://` and it corrupts the
generated sitemap.
