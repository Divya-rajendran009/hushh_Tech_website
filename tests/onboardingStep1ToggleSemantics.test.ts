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

describe("Onboarding step 1 toggle semantics", () => {
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

  it("exposes selected recurring options as pressed toggle buttons", async () => {
    await act(async () => {
      root.render(React.createElement(OnboardingStep1));
    });

    expect(getButton("weekly").getAttribute("aria-pressed")).toBe("true");
    expect(getButton("once a month").getAttribute("aria-pressed")).toBe("false");
    expect(getButton("15th of month").getAttribute("aria-pressed")).toBe("true");
    expect(getButton("1st of month").getAttribute("aria-pressed")).toBe("false");
    expect(getButton("$1M").getAttribute("aria-pressed")).toBe("true");
    expect(getButton("$500,000").getAttribute("aria-pressed")).toBe("false");
  });

  function getButton(name: string): HTMLButtonElement {
    const button = Array.from(container.querySelectorAll("button")).find(
      (candidate) => candidate.textContent?.trim() === name,
    );

    expect(button).toBeTruthy();
    return button as HTMLButtonElement;
  }
});
