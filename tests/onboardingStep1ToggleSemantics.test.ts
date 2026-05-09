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

  it("keeps only the selected option in each radio group tab order", async () => {
    await act(async () => {
      root.render(React.createElement(OnboardingStep1));
    });

    const [frequencyGroup, dayGroup, amountGroup] = getRadioGroups();

    expect(getGroupTabIndexes(frequencyGroup)).toEqual([-1, -1, 0, -1]);
    expect(getGroupTabIndexes(dayGroup)).toEqual([-1, 0, -1]);
    expect(getGroupTabIndexes(amountGroup)).toEqual([-1, -1, 0, -1]);
  });

  it("supports arrow-key navigation for recurring frequency options", async () => {
    await act(async () => {
      root.render(React.createElement(OnboardingStep1));
    });

    const weekly = getRadio("weekly");
    const biweekly = getRadio("bi-weekly");

    await act(async () => {
      weekly.focus();
      weekly.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    });

    expect(step1Logic.setFrequency).toHaveBeenCalledWith("every_other_week");
    expect(document.activeElement).toBe(biweekly);
  });

  it("supports arrow-key navigation for recurring day options", async () => {
    await act(async () => {
      root.render(React.createElement(OnboardingStep1));
    });

    const fifteenth = getRadio("15th of month");
    const first = getRadio("1st of month");

    await act(async () => {
      fifteenth.focus();
      fifteenth.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    });

    expect(step1Logic.setInvestmentDay).toHaveBeenCalledWith("1st of the month");
    expect(document.activeElement).toBe(first);
  });

  it("supports arrow-key navigation for recurring amount options", async () => {
    await act(async () => {
      root.render(React.createElement(OnboardingStep1));
    });

    const oneMillion = getRadio("$1M");
    const onePointFiveMillion = getRadio("$2M");

    await act(async () => {
      oneMillion.focus();
      oneMillion.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    });

    expect(step1Logic.handleAmountClick).toHaveBeenCalledWith(1500000);
    expect(document.activeElement).toBe(onePointFiveMillion);
  });

  function getRadioGroups(): HTMLElement[] {
    const groups = Array.from(container.querySelectorAll<HTMLElement>("[role='radiogroup']"));

    expect(groups).toHaveLength(3);
    return groups;
  }

  function getGroupTabIndexes(group: HTMLElement): number[] {
    return Array.from(group.querySelectorAll<HTMLButtonElement>("button[role='radio']")).map(
      (radio) => radio.tabIndex,
    );
  }

  function getRadio(name: string): HTMLButtonElement {
    const button = Array.from(container.querySelectorAll("button[role='radio']")).find(
      (candidate) => candidate.textContent?.trim() === name,
    );

    expect(button).toBeTruthy();
    return button as HTMLButtonElement;
  }
});
