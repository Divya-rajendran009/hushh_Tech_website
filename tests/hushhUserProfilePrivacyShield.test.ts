// @vitest-environment jsdom

import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const useHushhUserProfileLogicMock = vi.hoisted(() => vi.fn());

vi.mock("../src/pages/hushh-user-profile/logic", () => ({
  FIELD_LABELS: {
    primary_goal: "Primary goal",
  },
  VALUE_LABELS: {
    aggressive_growth: "Aggressive growth across concentrated AI infrastructure and private market opportunities",
  },
  useHushhUserProfileLogic: () => useHushhUserProfileLogicMock(),
}));

vi.mock("../src/components/hushh-tech-back-header/HushhTechBackHeader", () => ({
  default: () => null,
}));

vi.mock("../src/components/hushh-tech-cta/HushhTechCta", () => ({
  default: () => null,
  HushhTechCtaVariant: {
    BLACK: "black",
    WHITE: "white",
  },
}));

vi.mock("../src/components/hushh-tech-footer/HushhTechFooter", () => ({
  default: () => null,
  HushhFooterTab: {
    PROFILE: "profile",
  },
}));

vi.mock("../src/components/profile/NWSScoreBadge", () => ({
  default: () => null,
}));

vi.mock("../src/components/wallet/WalletCardPreviewModal", () => ({
  default: () => null,
}));

import HushhUserProfilePage from "../src/pages/hushh-user-profile/ui";

describe("HushhUserProfile PrivacyShield integration", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    useHushhUserProfileLogicMock.mockReturnValue({
      form: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        age: 36,
        phoneCountryCode: "+91",
        phoneNumber: "9876543210",
        organisation: "",
        accountType: "",
        selectedFund: "",
        referralSource: "",
        citizenshipCountry: "India",
        residenceCountry: "",
        accountStructure: "",
        legalFirstName: "",
        legalLastName: "",
        addressLine1: "",
        city: "",
        state: "",
        zipCode: "",
        dateOfBirth: "",
        initialInvestmentAmount: "",
      },
      investorProfile: null,
      loading: false,
      loadingSeconds: 0,
      isProcessing: false,
      investorStatus: "idle",
      hasOnboardingData: true,
      isApplePassLoading: false,
      isGooglePassLoading: false,
      nwsResult: null,
      nwsLoading: false,
      isWalletPreviewOpen: false,
      appleWalletSupported: false,
      appleWalletSupportMessage: "Apple Wallet unavailable",
      googleWalletSupported: false,
      googleWalletSupportMessage: "Google Wallet unavailable",
      walletPreview: null,
      hasCopied: false,
      onCopy: vi.fn(),
      profileUrl: "",
      navigate: vi.fn(),
      handleChange: vi.fn(),
      handleBack: vi.fn(),
      handleSave: vi.fn(),
      isDirty: false,
      isSaving: false,
      handleSaveChanges: vi.fn(),
      handleAppleWalletPass: vi.fn(),
      handleGoogleWalletPass: vi.fn(),
      COUNTRIES: ["India"],
      openWalletPreview: vi.fn(),
      closeWalletPreview: vi.fn(),
      editingField: null,
      setEditingField: vi.fn(),
      FIELD_OPTIONS: {},
      MULTI_SELECT_FIELDS: [],
      handleUpdateAIField: vi.fn(),
      handleMultiSelectToggle: vi.fn(),
      getConfidenceLabel: vi.fn(),
      getConfidenceBadgeClass: vi.fn(),
    });
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    vi.clearAllMocks();
  });

  it("renders the profile email and phone fields inside PrivacyShield controls", async () => {
    await act(async () => {
      root.render(React.createElement(HushhUserProfilePage));
    });

    expect(container.textContent).toContain("Visibility Controls");
    expect(
      (container.querySelector(
        'input[aria-label="Email address"]',
      ) as HTMLInputElement | null)?.value,
    ).toBe("ada@example.com");
    expect(
      (container.querySelector(
        'input[aria-label="Phone number"]',
      ) as HTMLInputElement | null)?.value,
    ).toBe("9876543210");
    expect(
      container.querySelectorAll('input[role="switch"]'),
    ).toHaveLength(2);
  });

  it("keeps AI preference confidence badges from wrapping while values truncate", async () => {
    const getConfidenceLabel = vi.fn(() => "High confidence");
    const getConfidenceBadgeClass = vi.fn(() => "border-emerald-200 text-emerald-700");

    useHushhUserProfileLogicMock.mockReturnValue({
      ...useHushhUserProfileLogicMock(),
      investorProfile: {
        primary_goal: {
          value: "aggressive_growth",
          confidence: 0.91,
        },
      },
      getConfidenceLabel,
      getConfidenceBadgeClass,
    });

    await act(async () => {
      root.render(React.createElement(HushhUserProfilePage));
    });

    const row = container.querySelector(
      '[aria-label="Edit Primary goal"]',
    ) as HTMLElement | null;
    expect(row).not.toBeNull();
    expect(row?.className).toContain("gap-3");

    const label = row?.querySelector("span:first-child") as HTMLElement | null;
    expect(label?.className).toContain("max-w-[42%]");
    expect(label?.className).toContain("truncate");

    const valueGroup = row?.querySelector("div") as HTMLElement | null;
    expect(valueGroup?.className).toContain("min-w-0");
    expect(valueGroup?.className).toContain("flex-1");

    const value = valueGroup?.querySelector("span:first-child") as HTMLElement | null;
    expect(value?.textContent).toContain("Aggressive growth");
    expect(value?.className).toContain("min-w-0");
    expect(value?.className).toContain("max-w-full");
    expect(value?.className).toContain("truncate");
    expect(value?.className).toContain("text-right");

    const badge = valueGroup?.querySelector("span:nth-child(2)") as HTMLElement | null;
    expect(badge?.textContent).toBe("High confidence");
    expect(badge?.className).toContain("shrink-0");
    expect(badge?.className).toContain("whitespace-nowrap");
    expect(badge?.className).toContain("leading-none");
  });
});
