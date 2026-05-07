// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

describe("consent preferences", () => {
  beforeEach(() => {
    vi.resetModules();
    window.localStorage.clear();
  });

  it("defaults optional categories off and keeps necessary consent enabled", async () => {
    const consent = await import("../src/services/consent/preferences");

    expect(consent.hasStoredConsentPreferences()).toBe(false);
    expect(consent.getConsentPreferences()).toEqual({
      necessary: true,
      analytics: false,
      personalization: false,
      marketing: false,
    });
  });

  it("persists granular choices and forces necessary consent on", async () => {
    const consent = await import("../src/services/consent/preferences");
    const listener = vi.fn();

    const unsubscribe = consent.onConsentPreferencesChange(listener);
    const saved = consent.saveConsentPreferences({
      necessary: false,
      analytics: true,
      personalization: false,
      marketing: true,
    });

    expect(saved).toMatchObject({
      necessary: true,
      analytics: true,
      personalization: false,
      marketing: true,
    });
    expect(consent.hasConsentFor("analytics")).toBe(true);
    expect(consent.hasStoredConsentPreferences()).toBe(true);
    expect(listener).toHaveBeenCalledWith(saved);

    unsubscribe();
  });
});
