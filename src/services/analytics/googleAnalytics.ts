import {
  sanitizeAnalyticsPath,
  trackPageViewEvent,
} from "./siteAnalytics";
import {
  hasConsentFor,
  onConsentPreferencesChange,
} from "../consent/preferences";

const GOOGLE_ANALYTICS_TRACKING_ID = "G-R58S9WWPM0";
const GOOGLE_ANALYTICS_SCRIPT_SRC = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_TRACKING_ID}`;
const DUPLICATE_PAGE_VIEW_WINDOW_MS = 1000;

let isAnalyticsConfigured = false;
let lastTrackedPageKey = "";
let lastTrackedAt = 0;
let hasRegisteredConsentListener = false;

function ensureGtagQueue() {
  window.dataLayer = window.dataLayer || [];

  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer.push(args);
    };
  }
}

function ensureAnalyticsScript() {
  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="${GOOGLE_ANALYTICS_SCRIPT_SRC}"]`
  );

  if (existingScript) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = GOOGLE_ANALYTICS_SCRIPT_SRC;
  script.dataset.hushhAnalytics = "true";
  document.head.appendChild(script);
}

function removeAnalyticsScript() {
  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="${GOOGLE_ANALYTICS_SCRIPT_SRC}"]`
  );

  existingScript?.remove();
}

function applyGoogleConsentMode() {
  ensureGtagQueue();

  window.gtag("consent", "update", {
    ad_storage: hasConsentFor("marketing") ? "granted" : "denied",
    analytics_storage: hasConsentFor("analytics") ? "granted" : "denied",
    ad_user_data: hasConsentFor("marketing") ? "granted" : "denied",
    ad_personalization: hasConsentFor("marketing") ? "granted" : "denied",
  });
}

function registerConsentListener() {
  if (hasRegisteredConsentListener) {
    return;
  }

  onConsentPreferencesChange(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    applyGoogleConsentMode();

    if (!hasConsentFor("analytics")) {
      removeAnalyticsScript();
      isAnalyticsConfigured = false;
      return;
    }

    initializeGoogleAnalytics();
  });

  hasRegisteredConsentListener = true;
}

export function initializeGoogleAnalytics() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  registerConsentListener();
  ensureGtagQueue();
  applyGoogleConsentMode();

  if (!hasConsentFor("analytics")) {
    removeAnalyticsScript();
    return;
  }

  ensureAnalyticsScript();

  if (isAnalyticsConfigured) {
    return;
  }

  window.gtag("js", new Date());
  window.gtag("config", GOOGLE_ANALYTICS_TRACKING_ID, {
    send_page_view: false,
  });

  isAnalyticsConfigured = true;
}

export function trackPageView(pathname: string, search = "", hash = "") {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  if (!hasConsentFor("analytics")) {
    return;
  }

  initializeGoogleAnalytics();

  const pagePath = sanitizeAnalyticsPath(pathname || "/", search, hash);
  const now = Date.now();
  if (
    pagePath === lastTrackedPageKey &&
    now - lastTrackedAt < DUPLICATE_PAGE_VIEW_WINDOW_MS
  ) {
    return;
  }

  lastTrackedPageKey = pagePath;
  lastTrackedAt = now;

  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: `${window.location.origin}${pagePath}`,
    page_path: pagePath,
  });

  trackPageViewEvent(pathname, search, hash);
}

export { GOOGLE_ANALYTICS_TRACKING_ID };
