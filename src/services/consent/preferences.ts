export type ConsentCategory =
  | "necessary"
  | "analytics"
  | "personalization"
  | "marketing";

export type ConsentPreferences = Record<ConsentCategory, boolean>;

export const CONSENT_STORAGE_KEY = "hushh_consent_preferences";
export const CONSENT_VERSION = 1;

const DEFAULT_PREFERENCES: ConsentPreferences = {
  necessary: true,
  analytics: false,
  personalization: false,
  marketing: false,
};

type StoredConsentPreferences = {
  version: number;
  updatedAt: string;
  preferences: ConsentPreferences;
};

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function normalizePreferences(
  preferences: Partial<ConsentPreferences> | undefined
): ConsentPreferences {
  return {
    ...DEFAULT_PREFERENCES,
    ...(preferences || {}),
    necessary: true,
  };
}

function readStoredConsent(): StoredConsentPreferences | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as Partial<StoredConsentPreferences>;
    return {
      version: parsed.version || CONSENT_VERSION,
      updatedAt: parsed.updatedAt || new Date(0).toISOString(),
      preferences: normalizePreferences(parsed.preferences),
    };
  } catch {
    return null;
  }
}

function emitConsentChange(preferences: ConsentPreferences) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("hushh:consent-preferences-changed", {
      detail: preferences,
    })
  );
}

export function hasStoredConsentPreferences() {
  return readStoredConsent() !== null;
}

export function getConsentPreferences(): ConsentPreferences {
  return readStoredConsent()?.preferences || DEFAULT_PREFERENCES;
}

export function hasConsentFor(category: ConsentCategory) {
  return getConsentPreferences()[category];
}

export function saveConsentPreferences(
  preferences: Partial<ConsentPreferences>
): ConsentPreferences {
  const nextPreferences = normalizePreferences(preferences);

  if (canUseStorage()) {
    const payload: StoredConsentPreferences = {
      version: CONSENT_VERSION,
      updatedAt: new Date().toISOString(),
      preferences: nextPreferences,
    };

    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  }

  emitConsentChange(nextPreferences);
  return nextPreferences;
}

export function acceptAllConsentPreferences() {
  return saveConsentPreferences({
    necessary: true,
    analytics: true,
    personalization: true,
    marketing: true,
  });
}

export function declineOptionalConsentPreferences() {
  return saveConsentPreferences(DEFAULT_PREFERENCES);
}

export function onConsentPreferencesChange(
  callback: (preferences: ConsentPreferences) => void
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = (event: Event) => {
    callback(
      (event as CustomEvent<ConsentPreferences>).detail ||
        getConsentPreferences()
    );
  };

  window.addEventListener("hushh:consent-preferences-changed", handler);
  return () => {
    window.removeEventListener("hushh:consent-preferences-changed", handler);
  };
}
