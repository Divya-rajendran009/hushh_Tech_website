const CONSENT_STORAGE_KEY = "hushh_cookie_consent";

export type ConsentValue = "accepted" | "rejected";

export const getStoredConsent = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(CONSENT_STORAGE_KEY) === "accepted";
};

export const setStoredConsent = (value: ConsentValue): void => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
};

export const CONSENT_KEY = CONSENT_STORAGE_KEY;