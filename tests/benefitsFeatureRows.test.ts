// @vitest-environment jsdom

import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import BenefitsPage from "../src/pages/benefits";

describe("Benefits feature rows", () => {
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
  });

  it("keeps check icons aligned with consistently spaced feature text", async () => {
    await act(async () => {
      root.render(React.createElement(BenefitsPage));
    });

    const rows = Array.from(container.querySelectorAll("li"));

    expect(rows).toHaveLength(24);

    rows.forEach((row) => {
      expect(row.className).toContain("items-start");
      expect(row.className).toContain("gap-3.5");

      const icon = row.querySelector("svg");

      expect(icon?.getAttribute("class")).toContain("mt-[3px]");
      expect(icon?.getAttribute("class")).toContain("shrink-0");
    });
  });

  it("uses a responsive card grid with roomier feature-row spacing", async () => {
    await act(async () => {
      root.render(React.createElement(BenefitsPage));
    });

    const cardGrid = container.querySelector('[data-testid="benefits-card-grid"]');
    const featureLists = Array.from(container.querySelectorAll("ul"));
    const ctaCard = Array.from(container.querySelectorAll("section")).at(-1);

    expect(cardGrid?.className).toContain("grid");
    expect(cardGrid?.className).toContain("gap-4");
    expect(cardGrid?.className).toContain("sm:gap-5");
    expect(cardGrid?.className).toContain("lg:grid-cols-2");
    expect(cardGrid?.className).toContain("lg:gap-6");
    expect(cardGrid?.className).toContain("xl:gap-8");
    expect(ctaCard?.className).toContain("lg:col-span-2");

    featureLists.forEach((list) => {
      expect(list.className).toContain("gap-y-3");
      expect(list.className).toContain("sm:gap-y-3.5");
      expect(list.className).toContain("md:gap-y-4");
    });
  });

  it("keeps section headers spaced responsively from their feature rows", async () => {
    await act(async () => {
      root.render(React.createElement(BenefitsPage));
    });

    const sectionHeaders = Array.from(
      container.querySelectorAll("section > div:first-child"),
    ).filter((header) => header.querySelector("h2"));

    expect(sectionHeaders).toHaveLength(4);

    sectionHeaders.forEach((header) => {
      expect(header.className).toContain("mb-5");
      expect(header.className).toContain("sm:mb-6");
      expect(header.className).toContain("sm:flex-row");
    });
  });
});
