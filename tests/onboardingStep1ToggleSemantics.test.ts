// @vitest-environment jsdom

import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const step1Logic = vi.hoisted(() => ({
  handleAmountClick: vi.fn(),
  handleBack: vi.fn(),
  handleCustomAmountChange: vi.fn(),
  handleNext: vi.fn(),
  handleUnitChange: vi.fn(),
  setFrequency: vi.fn(),
  setInvestmentDay: vi.fn(),
  toggleRecurring: vi.fn(),
}));

vi.mock("../src/pages/onboarding/step-1/logic", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../src/pages/onboarding/step-1/logic")>();

  return {
    ...actual,
    useStep1Logic: () => ({
      units: { class_a: 1, class_b: 0, class_c: 0 },
      frequency: "weekly",
      investmentDay: "15th of the month",
      selectedAmount: 1000000,
      customAmount: "",
      customAmountError: null,
      error: null,
      isLoading: false,
      isFooterVisible: true,
      totalInvestment: 25000000,
      hasSelection: true,
      recurringEnabled: true,
      ...step1Logic,
    }),
  };
});

import OnboardingStep1 from "../src/pages/onboarding/step-1/ui";

describe("Onboarding step 1 option group semantics", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    vi.clearAllMocks();
  });

  it("exposes selected recurring options as radio groups", async () => {
    await act(async () => {
      root.render(React.createElement(OnboardingStep1));
    });

    const groups = Array.from(container.querySelectorAll("[role='radiogroup']"));

    expect(groups.map((group) => group.getAttribute("aria-label"))).toEqual([
      "Recurring investment frequency",
      "Recurring investment debit day",
      "Recurring investment amount",
    ]);

    expect(getRadio("weekly").getAttribute("aria-checked")).toBe("true");
    expect(getRadio("once a month").getAttribute("aria-checked")).toBe("false");
    expect(getRadio("15th of month").getAttribute("aria-checked")).toBe("true");
    expect(getRadio("1st of month").getAttribute("aria-checked")).toBe("false");
    expect(getRadio("$1M").getAttribute("aria-checked")).toBe("true");
    expect(getRadio("$500,000").getAttribute("aria-checked")).toBe("false");
  });

  function getRadio(name: string): HTMLButtonElement {
    const button = Array.from(container.querySelectorAll("button[role='radio']")).find(
      (candidate) => candidate.textContent?.trim() === name,
    );

    expect(button).toBeTruthy();
    return button as HTMLButtonElement;
  }
});
