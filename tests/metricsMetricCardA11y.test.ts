// @vitest-environment jsdom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { EmptyWidgetMessage, MetricCard } from "../src/pages/metrics";

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

  it("announces empty dashboard widgets as polite status messages", async () => {
    await act(async () => {
      root.render(
        React.createElement(
          EmptyWidgetMessage,
          null,
          "No KPI flow rows are available for this window."
        )
      );
    });

    const status = container.querySelector('[role="status"]');

    expect(status?.getAttribute("aria-live")).toBe("polite");
    expect(status?.textContent).toContain(
      "No KPI flow rows are available for this window."
    );
  });
});
