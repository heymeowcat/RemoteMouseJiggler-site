# Backlink strategy — Remote Mouse Jiggler

The site is live at **https://heymeowcat.is-a.dev/RemoteMouseJiggler-site/**

Everything below is either already implemented (marked **Done**) or is a
repeatable action. It is ordered by expected impact per hour of effort.

---

## 1. Why link building works for this app

Remote Mouse Jiggler sits in a niche with three advantages that most apps
do not have:

- **It is free.** No price is a genuine differentiator for a utility that
  replaces a physical accessory.
- **It has a genuinely unusual feature.** The *coding emulator* jiggler
  pattern — a bot that types realistic code with human-like typos and backspace
  corrections — is a story. It is the single most linkable thing about the
  product and it has its own page: `/jiggler-patterns/`.
- **It makes a bold privacy claim that is verifiable.** No `INTERNET`
  permission is in the manifest. That is checkable by anyone, which makes it
  citable.

The strategy is therefore: **own the "bluetooth mouse jiggler for Android"
and "no-internet mouse jiggler" queries, then earn links from the places
that already rank for them.**

> **Note on GitHub.** The app repository is private and the app is not open
> source, so there is no public repository link to earn. Every "view the
> source" button has been removed from the site and the "open source" and
> "MIT licence" claims have been struck from the copy. Do not reintroduce
> them, and do not link to the private repository.

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
| `/` hero preview | A faithful picture of the app's real jiggler screen, so a visitor understands the product in three seconds. |
| Schema markup | `SoftwareApplication`, `FAQPage`, `BreadcrumbList`, `WebPage`, `TechArticle`, `Organization`. |
| `sitemap.xml` + `robots.txt` | Generated on every build from the real routes. |
| Descriptive link text | Every internal link says what it points at. |

---

## 3. Authority sources that are actionable today

### 3.1 Google Play (Done)

The Play listing is the single strongest link source available, because it is
permanently indexed, topically exact, and carries a high-trust domain. Two
fields matter:

- **Website** — points at `heymeowcat.is-a.dev/RemoteMouseJiggler-site/`.
- **Developer email** — `support@heymeowcat.is-a.dev`.

The listing description should also mention the privacy claim and the eight
patterns, and link to `/press/` if the field allows it.

### 3.2 The developer's personal site (Done)

`heymeowcat.is-a.dev` is the developer's portfolio and lives on the same
domain, so the two properties reinforce each other. The portfolio should list
the app with a link to the app site, and the app site's footer already links
back to the developer. This is the one cross-linking pair that already exists
and it is worth keeping.

### 3.3 The press kit (Done)

`/press/` exists specifically to be linked to and quoted from. It offers the
icon, the brand colours and a ready-made paragraph, which removes the two
biggest reasons a writer does not cover a small app: no artwork and no time
to write copy.

### 3.4 App directories and lists (To do)

There are directories that list Android utilities, and most of them simply
need a URL and a screenshot:

- Alternative app catalogues and "best Android utilities" round-ups
- Region-specific Android app directories
- Privacy-focused app directories that specifically list apps with no
  internet permission — the strongest niche fit for this app

### 3.5 Community answers (To do, highest ROI per unit effort)

Search Stack Overflow, Super User, Reddit and the Android Discord for
questions like *"how to stop my screen from locking without installing
software"*, *"USB mouse jiggler alternative"*, *"use my phone as a mouse for
my PC"*. Answer with a direct explanation of the Bluetooth HID approach and
link to `/jiggler-patterns/`. Do not paste marketing copy — answer the
question, then mention the app. This is the single best source of
non-paid, topically relevant links.

---

## 4. Outreach programme

### 4.1 Launch posts (repeatable per release)

Every release gets a Hacker News and Reddit submission. The app is free,
privacy-first and solves a small but real annoyance, which is exactly what
those audiences reward. The post title should name the problem, not the
product: *"I built an Android app that turns your phone into a Bluetooth
mouse — it types fake code so my screen doesn't sleep"* performs better than
*"Remote Mouse Jiggler v1.0.4 released"*.

Subreddits that work: `r/androidapps`, `r/FOSS`, `r/privacy`, `r/sysadmin`,
`r/remotework`.

### 4.2 Listicle and round-up outreach (To do)

Target pages that already rank for the head terms. Search for pages
mentioning "mouse jiggler", "keep computer awake", "USB mouse jiggler
alternative" and send the developer a short note:

> Remote Mouse Jiggler might be worth adding to your list of ways to keep a
> session alive. It sends real Bluetooth HID input from an Android phone, so
> there is nothing to install on the machine, and it needs no internet
> permission. Free: [link]

Always offer the press kit, never demand a link. Expect a low acceptance rate
and treat any single accepted link as a bonus.

### 4.3 Privacy publications (To do)

Because the privacy claim is verifiable, privacy-focused outlets are a good
fit: PrivacyTools, The Markup, Restore Privacy. A short piece on "how to keep
a screen awake without installing anything on your work machine" is genuinely
useful to their readers.

### 4.4 Creator and newsletter outreach (To do)

Productivity and "work from anywhere" newsletters write about staying
awake in long sessions. Offer the developer as a source with the coding
emulator angle — it is the hook that stops a scroll.

---

## 5. Anchor text plan

Natural, varied, and never exact-match on every link.

| Type | Examples |
| --- | --- |
| Brand | Remote Mouse Jiggler, Remote Mouse Jiggler app |
| Descriptive | Bluetooth mouse jiggler for Android, Android mouse jiggler app, Bluetooth HID mouse for Android |
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
- **Play Console** → store listing visitors and install conversion, which is
  the real business metric.
- **Manual referring-domain checks** — a monthly search for
  `link:heymeowcat.is-a.dev/RemoteMouseJiggler-site` and
  `"Remote Mouse Jiggler" -play.google.com`.

---

## 7. Do not do these

- **Do not buy links.** A paid link to a page that claims "no tracking" is
  self-defeating.
- **Do not run a link farm, a PBN, or a comment spam campaign.** Same reason.
- **Do not use automated link-building tools.** They generate toxic anchors
  that get the site penalised.
- **Do not create low-quality guest posts.** One good, genuinely useful
  article on a relevant site beats fifty thin ones.
- **Do not link to the private repository.** It returns a 404 to readers and
  wastes the link equity.
