// @vitest-environment jsdom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { DashboardStatSection, MetricCard } from "../src/pages/metrics";

describe("metrics MetricCard accessibility", () => {
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

  async function renderMetricCard() {
    await act(async () => {
      root.render(
        React.createElement(MetricCard, {
          eyebrow: "Audience",
          label: "Total users",
          value: "1,234",
        })
      );
    });
  }

  it("labels metric values with their visible metric name without repeating the label", async () => {
    await renderMetricCard();

    const valueHeading = container.querySelector("h3");
    const visibleLabel = container.querySelector("p.mt-2");

    expect(valueHeading?.getAttribute("aria-label")).toBe("Total users: 1,234");
    expect(visibleLabel?.textContent).toBe("Total users");
    expect(visibleLabel?.getAttribute("aria-hidden")).toBe("true");
  });

  it("names dashboard stat groups with hidden headings and descriptions", async () => {
    await act(async () => {
      root.render(
        React.createElement(
          DashboardStatSection,
          {
            id: "test-stat-group",
            title: "Traffic dashboard stats",
            description: "Traffic totals for the selected reporting window.",
            className: "grid",
          },
          React.createElement(MetricCard, {
            eyebrow: "Traffic",
            label: "Sessions",
            value: "42",
          })
        )
      );
    });

    const statGroup = container.querySelector("section");
    const heading = container.querySelector("#test-stat-group");
    const description = container.querySelector("#test-stat-group-description");

    expect(statGroup?.getAttribute("aria-labelledby")).toBe("test-stat-group");
    expect(statGroup?.getAttribute("aria-describedby")).toBe(
      "test-stat-group-description"
    );
    expect(heading?.className).toContain("sr-only");
    expect(heading?.textContent).toBe("Traffic dashboard stats");
    expect(description?.className).toContain("sr-only");
    expect(description?.textContent).toBe(
      "Traffic totals for the selected reporting window."
    );
  });
});
