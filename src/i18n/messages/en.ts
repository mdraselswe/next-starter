/**
 * ✏️ Every UI string. Components call t("key"); `{name}` placeholders are
 * filled from the second argument. Add a locale by copying this file to
 * messages/<locale>.ts (typed as `Messages`) and registering it in i18n/index.ts.
 */
export const en = {
  "a11y.skip": "Skip to content",
  "nav.home": "Home",
  "nav.about": "About",
  "nav.menu": "Menu",
  "nav.close": "Close menu",
  "theme.system": "Theme: match device",
  "theme.light": "Theme: light",
  "theme.dark": "Theme: dark",
  "footer.rights": "© {year} {name}. All rights reserved.",
  "footer.social": "{name} on {network}",
  "about.title": "About",
  "about.sub": "An example page. Copy it to add your own.",
  "notFound.title": "Page not found",
  "notFound.body": "The page you are looking for doesn't exist or has moved.",
  "notFound.cta": "Go home",
  "error.title": "Something went wrong",
  "error.body": "Please try again. If it keeps happening, reload the page.",
  "error.retry": "Try again",
  "loading.label": "Loading",
  "pwa.title": "Install {name}",
  "pwa.sub": "Open it like an app, fast and even offline.",
  "pwa.install": "Install app",
  "pwa.later": "Not now",
  "pwa.close": "Close",
  "pwa.footer": "Install the app",
  "pwa.offline": "You're offline. Pages you've visited still work.",
  "pwa.ios1": "Tap [Share] in Safari's toolbar.",
  "pwa.ios2": "Choose [Add to Home Screen].",
  "pwa.ios3": "Tap [Add]. {name} appears on your home screen.",
  "pwa.android1": "Open the browser menu [⋮].",
  "pwa.android2": "Tap [Install app] or [Add to Home screen].",
  "pwa.android3": "Confirm. {name} appears with your apps.",
  "pwa.desktop1": "Click the [install] icon in the address bar.",
  "pwa.desktop2": "Or open the browser menu and choose [Install {name}].",
  "pwa.desktop3": "It opens in its own window, like an app.",
  "pwa.mac1": "In Safari, choose [File] → [Add to Dock].",
  "pwa.mac2": "{name} opens from the Dock like an app.",
  "pwa.unsupported": "Your browser can't install apps. Try Chrome, Edge or Safari.",
} as const;

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;
