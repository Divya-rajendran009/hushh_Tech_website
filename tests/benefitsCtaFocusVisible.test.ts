import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { chromium, type Browser, type Page } from "playwright";
import react from "@vitejs/plugin-react";
import { createServer, type ViteDevServer } from "vite";

describe("Benefits CTA focus visibility", () => {
  let browser: Browser;
  let page: Page;
  let server: ViteDevServer;
  let baseUrl: string;

  beforeAll(async () => {
    server = await createServer({
      root: process.cwd(),
      configFile: false,
      plugins: [react()],
      server: {
        host: "127.0.0.1",
        port: 0,
      },
    });
    await server.listen();

    const localUrl = server.resolvedUrls?.local[0];

    if (!localUrl) {
      throw new Error("Vite did not expose a local test server URL.");
    }

    baseUrl = localUrl;
    browser = await chromium.launch();
    page = await browser.newPage({
      viewport: { width: 1024, height: 768 },
    });
  });

  afterAll(async () => {
    await page?.close();
    await browser?.close();
    await server?.close();
  });

  it("applies a visible computed focus outline to the career CTA after keyboard focus", async () => {
    await page.goto(
      new URL("tests/fixtures/benefits-focus-proof.html", baseUrl).toString(),
      { waitUntil: "networkidle" }
    );

    const careerCta = page.locator('a[href="/career"]');

    await page.keyboard.press("Tab");
    await page.waitForFunction(() => {
      return document.activeElement?.getAttribute("href") === "/career";
    });

    const focusStyles = await careerCta.evaluate((element) => {
      const styles = window.getComputedStyle(element);

      return {
        outlineColor: styles.outlineColor,
        outlineOffset: styles.outlineOffset,
        outlineStyle: styles.outlineStyle,
        outlineWidth: styles.outlineWidth,
      };
    });

    expect(focusStyles).toEqual({
      outlineColor: "rgb(0, 102, 204)",
      outlineOffset: "4px",
      outlineStyle: "solid",
      outlineWidth: "2px",
    });
  });
});
