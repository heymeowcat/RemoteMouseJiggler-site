/**
 * Single source of truth for brand, URLs and metadata.
 *
 * Everything here mirrors the real Android app (package
 * `com.heymeowcat.remotemousejiggler`) so copy on the site never drifts from
 * what the app actually ships.
 */

export const SITE = {
    name: "Remote Mouse Jiggler",
    tagline: "Your phone becomes a Bluetooth mouse, keyboard and mouse jiggler",
    origin: "https://heymeowcat.is-a.dev",
    base: "/RemoteMouseJiggler-site",
    /** Absolute canonical URL of the site root. */
    url: "https://heymeowcat.is-a.dev/RemoteMouseJiggler-site/",
    locale: "en_US",
    lang: "en",

    playUrl:
        "https://play.google.com/store/apps/details?id=com.heymeowcat.remotemousejiggler",
    githubUrl: "https://github.com/heymeowcat/RemoteMouseJiggler",
    siteRepoUrl: "https://github.com/heymeowcat/RemoteMouseJiggler-site",
    developerUrl: "https://heymeowcat.is-a.dev",
    linkedinUrl: "https://linkedin.com/in/vidura-fernando",

    developer: "heymeowcat",
    developerName: "Vidura Fernando",
    email: "support@heymeowcat.is-a.dev",

    packageName: "com.heymeowcat.remotemousejiggler",
    version: "1.0.4",
    versionCode: 9,
    minSdk: "Android 9.0 (API 28)",
    targetSdk: "Android 16 (API 36)",
    price: "Free",
    priceValue: "0",
    currency: "USD",
    category: "Utilities",

    /** Brand palette, sampled directly from remote-mouse-jiggler-logo.png. */
    brand: {
        blue: "#3f19bc",
        blueDeep: "#2a1090",
        yellow: "#ffb700",
        yellowLight: "#ffc21a",
    },
};

/** Primary navigation. Slugs are lowercase, hyphen-free and permanent. */
export const NAV = [
    { label: "Features", href: "/features/" },
    { label: "Jiggler patterns", href: "/jiggler-patterns/" },
    { label: "How it works", href: "/bluetooth-hid/" },
    { label: "FAQ", href: "/faq/" },
    { label: "Changelog", href: "/changelog/" },
];
