// @vitest-environment jsdom

import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/auth/AuthSessionProvider", () => ({
  useAuthSession: () => ({
    status: "unauthenticated",
    signOut: vi.fn(),
  }),
}));

import MobileBottomNav from "../src/components/MobileBottomNav";
import HushhTechNavDrawer from "../src/components/hushh-tech-nav-drawer/HushhTechNavDrawer";
import theme from "../src/theme";

describe("navigation semantic list structure", () => {
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

  function childTags(element: Element | null) {
    return element ? Array.from(element.children).map((child) => child.tagName) : [];
  }

  it("renders mobile bottom navigation as a named list of links", async () => {
    await act(async () => {
      root.render(
        React.createElement(
          MemoryRouter,
          { initialEntries: ["/"] },
          React.createElement(
            ChakraProvider,
            { theme },
            React.createElement(MobileBottomNav),
          ),
        ),
      );
    });

    const nav = container.querySelector("nav[aria-label='Primary mobile navigation']");
    const list = nav?.querySelector("ul");
    const items = list?.querySelectorAll(":scope > li") ?? [];

    expect(nav).not.toBeNull();
    expect(list).not.toBeNull();
    expect(childTags(list)).toEqual(["LI", "LI", "LI", "LI"]);
    expect(items).toHaveLength(4);
    expect(list?.querySelectorAll("a")).toHaveLength(4);
    expect(list?.querySelectorAll("button")).toHaveLength(0);
  });

  it("renders drawer navigation groups as named lists", async () => {
    await act(async () => {
      root.render(
        React.createElement(
          MemoryRouter,
          { initialEntries: ["/"] },
          React.createElement(HushhTechNavDrawer, {
            isOpen: true,
            onClose: vi.fn(),
          }),
        ),
      );
    });

    const expectedGroups = [
      ["Main menu", 5],
      ["Featured action", 1],
      ["Secondary menu", 2],
      ["Account menu", 2],
    ] as const;

    for (const [label, itemCount] of expectedGroups) {
      const nav = container.querySelector(`nav[aria-label='${label}']`);
      const list = nav?.querySelector("ul");

      expect(nav).not.toBeNull();
      expect(list).not.toBeNull();
      expect(childTags(list)).toEqual(Array(itemCount).fill("LI"));
      expect(list?.querySelectorAll("a")).toHaveLength(itemCount);
      expect(list?.querySelectorAll("button")).toHaveLength(0);
    }
  });
});
