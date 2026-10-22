# Backlink strategy — Remote Mouse Jiggler

The site is live at **https://heymeowcat.is-a.dev/RemoteMouseJiggler-site/**

Everything below is either already implemented (marked **Done**) or is a
repeatable action. It is ordered by expected impact per hour of effort.

---

## 1. Why link building works for this app

Remote Mouse Jiggler sits in a niche with three advantages that most apps
do not have:

- **It is free and open source.** Open-source Android apps get cited by
  privacy-focused blogs and "best F-Droid-style alternatives" listicles.
- **It has a genuinely unusual feature.** The *coding emulator* jiggler
  pattern — a bot that types realistic code with human typos and backspace
  corrections — is a story. It is the single most linkable thing about the
  product and it now has its own page: `/jiggler-patterns/`.
- **It makes a bold privacy claim that is verifiable.** No `INTERNET`
  permission is in the manifest. That is checkable by anyone, which makes it
  citable.

The strategy is therefore: **own the "bluetooth mouse jiggler for Android"
and "no-internet mouse jiggler" queries, then earn links from the places
that already rank for them.**

---

## 2. On-site groundwork (Done)

Link building fails if the site cannot convert. These are in place:

| Asset | Purpose |
| --- | --- |
| `/press/` | Press kit: icon download, brand colours, boilerplate paragraph, key facts. Built to be quoted by bloggers and used in newsletters. |
| `/download/` | Dedicated install page with requirements and the package name, so "download" queries land somewhere useful. |
| `/jiggler-patterns/` | The deep-dive page for the app's most differentiated feature. Primary link target. |
| `/faq/` | Full FAQ with `FAQPage` schema. Eligible for FAQ rich results, which pulls impressions and links. |
| `/changelog/` | Release history. Gives the site a freshness signal and a reason to be re-crawled. |
| `/bluetooth-hid/` | Explains the protocol. Targets technical queries and earns links from developer blogs. |
| Schema markup | `SoftwareApplication`, `FAQPage`, `BreadcrumbList`, `WebPage`, `TechArticle`, `Organization`. |
| `sitemap.xml` + `robots.txt` | Generated on every build from the real routes. |
| Descriptive link text | Every internal link says what it points at. |

---

## 3. Authority sources that are actionable today

### 3.1 GitHub (Done)

- The **app repository README** links to the website and to the Play Store
  listing, with a short description matching the site.
- The **site repository README** links back to the app repository and to the
  Play listing, forming a two-way pair.
- Every repository has `Topics` set: `android`, `bluetooth`, `hid`, `mouse`,
  `jiggler`, `remote`, `keyboard`, `trackpad`, `open-source`.

### 3.2 Google Play (Done — needs one manual edit)

The Play listing's "Website" and "Developer email" fields already point at
`heymeowcat.is-a.dev`. The listing description should also link to
`/press/` so that Play readers can reach the assets.

### 3.3 The developer's personal site (Done)

`heymeowcat.is-a.dev` is the developer's portfolio and lives on the same
domain, so the two properties reinforce each other. The portfolio should list
the app with a link to the app site, and the app site's footer already links
back to the developer.

### 3.4 Alternative app stores (To do — high value, low effort)

These are the highest-yield remaining links because the listing pages are
permanently indexed and directly relevant:

- [F-Droid](https://f-droid.org) — the app is MIT licensed and builds from
  source, so it qualifies. An F-Droid listing is a permanent, highly
  relevant backlink.
- [IzzyOnDroid](https://izzy.on.de) — review-based, needs an APK and a short
  pitch.
- [Hacker News](https://news.ycombinator.com) — see 4.1.

---

## 4. Outreach programme

### 4.1 Launch posts (repeatable per release)

Every release gets a Hacker News and Reddit submission. The app is
open-source, privacy-first and solves a small but real annoyance, which is
exactly what those audiences reward. The post title should name the problem,
not the product: *"I built an Android app that turns your phone into a
Bluetooth mouse — it types fake code so my screen doesn't sleep"* performs
better than *"Remote Mouse Jiggler v1.0.4 released"*.

Subreddits that work: `r/androidapps`, `r/FOSS`, `r/privacy`, `r/sysadmin`,
`r/生产力` equivalents, `r/remotework`.

### 4.2 Listicle and round-up outreach (To do)

Target pages that already rank for the head terms. Search for pages
mentioning "mouse jiggler", "keep computer awake", "USB mouse jiggler
alternative" and send the developer a short note:

> Remote Mouse Jiggler (open source, no dongle, no PC software) might be
> worth adding to your list of ways to keep a session alive. It sends real
> Bluetooth HID input from an Android phone and needs no internet permission.
> Free, MIT licensed: [link]

Always offer the press kit, never demand a link. Expect a low acceptance rate
and treat any single accepted link as a bonus.

### 4.3 Privacy and open-source publications (To do)

Because the privacy claim is verifiable, privacy-focused outlets are a good
fit: PrivacyTools, The Markup, Restore Privacy, and the F-Droid / Fossily
ecosystem. A short piece on "how to keep a screen awake without installing
anything on your work machine" is genuinely useful to their readers.

### 4.4 Community answers (To do, highest ROI per unit effort)

Search Stack Overflow, Super User, Reddit and the Android Discord for
questions like *"how to stop my screen from locking without installing
software"*, *"USB mouse jiggler alternative"*, *"use my phone as a mouse for
my PC"*. Answer with a direct explanation of the Bluetooth HID approach and
link to `/jiggler-patterns/`. Do not paste marketing copy — answer the
question, then mention the app. This is the single best source of
non-paid, topically relevant links.

---

## 5. Anchor text plan

Natural, varied, and never exact-match on every link.

| Type | Examples |
| --- | --- |
| Brand | Remote Mouse Jiggler, Remote Mouse Jiggler app |
| Descriptive | Bluetooth mouse jiggler for Android, Android mouse jiggler app, open source Bluetooth HID mouse |
| URL | `heymeowcat.is-a.dev/RemoteMouseJiggler-site/` |
| Naked URL | `https://heymeowcat.is-a.dev/RemoteMouseJiggler-site/` |

Avoid commercial anchors such as "free mouse jiggler download" — they read as
paid placement and carry no trust.

---

## 6. Measurement

There is no analytics script on the site, and that is deliberate: it would
contradict the product's privacy claim. Use these instead.

- **Google Search Console** → Performance → Links. This is the authoritative
  backlink report for a Google index, and it is already set up. See
  `docs/SEO-CHECKLIST.md`.
- **GitHub** → the repository's traffic tab, and the number of stars and
  forks as a proxy for attention.
- **Play Console** → store listing visitors and install conversion, which is
  the real business metric.

---

## 7. Do not do these

- **Do not buy links.** A paid link to a page that claims "no tracking" is
  self-defeating.
- **Do not run a link farm, a PBN, or a comment spam campaign.** Same reason.
- **Do not use automated link-building tools.** They generate toxic anchors
  that get the site penalised.
- **Do not create low-quality guest posts.** One good, genuinely useful
  article on a relevant site beats fifty thin ones.
