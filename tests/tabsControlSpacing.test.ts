// @vitest-environment jsdom

import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../src/components/ui/tabs";

describe("Tabs control spacing", () => {
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

  it("keeps adjacent tab controls on the shared compact spacing rhythm", async () => {
    await act(async () => {
      root.render(
        React.createElement(
          Tabs,
          { defaultValue: "overview" },
          React.createElement(
            TabsList,
            { className: "justify-center" },
            React.createElement(TabsTrigger, { value: "overview" }, "Overview"),
            React.createElement(TabsTrigger, { value: "activity" }, "Activity"),
          ),
          React.createElement(TabsContent, { value: "overview" }, "Overview content"),
          React.createElement(TabsContent, { value: "activity" }, "Activity content"),
        ),
      );
    });

    const triggers = Array.from(container.querySelectorAll("button"));
    const tabsList = triggers[0].parentElement;

    expect(tabsList?.className).toContain("gap-2");
    expect(tabsList?.className).toContain("flex-wrap");
    expect(tabsList?.className).toContain("justify-center");
    expect(triggers[0].className).toContain("min-h-10");
    expect(triggers[0].type).toBe("button");
  });
});
