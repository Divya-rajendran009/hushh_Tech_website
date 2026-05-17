import { expect, test, type Page } from "@playwright/test";

const rowMarkup = `
  <main class="mx-auto w-full max-w-md bg-white px-6 py-8 text-gray-900">
    <section class="mb-12">
      <div class="mb-8">
        <div class="mb-2 flex items-center justify-between">
          <h2 class="font-serif text-2xl font-medium tracking-tight text-black">
            Investment <span class="font-light italic text-gray-400">Profile.</span>
          </h2>
          <span class="inline-flex items-center gap-1.5 rounded-full border border-hushh-blue/20 bg-hushh-blue/5 px-3 py-1">
            <span class="h-1.5 w-1.5 rounded-full bg-hushh-blue"></span>
            <span class="text-[10px] font-medium uppercase tracking-[0.14em] text-hushh-blue">AI Analyzed</span>
          </span>
        </div>
        <p class="text-xs leading-relaxed text-gray-500">
          AI-detected preferences based on your profile data. Tap any field to adjust.
        </p>
      </div>

      <p class="mb-4 mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">AI Preferences</p>
      <div class="py-1" data-testid="profile-row-list">
        ${[
          ["Primary goal", "Aggressive growth across concentrated AI infrastructure and private market opportunities", "High confidence"],
          ["Investment horizon", "More than 10 years with opportunistic liquidity windows", "Medium confidence"],
          ["Risk tolerance", "Very high risk tolerance with active private market participation", "Low confidence"],
        ]
          .map(
            ([label, value, confidence]) => `
              <div
                class="group flex cursor-pointer items-center justify-between gap-3 border-b border-gray-100 py-4 transition-colors hover:bg-gray-50/50"
                role="button"
                tabindex="0"
                aria-label="Edit ${label}"
                data-testid="profile-row"
              >
                <span class="max-w-[42%] shrink-0 truncate text-sm font-light text-gray-500">${label}</span>
                <div class="flex min-w-0 flex-1 items-center justify-end gap-2">
                  <span class="min-w-0 max-w-full truncate text-right text-sm font-medium text-black">${value}</span>
                  <span class="shrink-0 whitespace-nowrap rounded-full border border-emerald-200 px-1.5 py-0.5 text-[9px] leading-none text-emerald-700">${confidence}</span>
                </div>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  </main>
`;

async function mockWalletModule(page: Page) {
  await page.route("**/api/shared/walletPassModel.js", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/javascript",
      body: `
        export const buildGoldPassPayload = () => ({});
        export const buildWalletCardContent = () => ({});
      `,
    });
  });
}

async function renderProfileRowFixture(page: Page) {
  await mockWalletModule(page);

  const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });

  await page.evaluate((markup) => {
    const root = document.querySelector("#root");
    if (!root) {
      throw new Error("Missing Vite app root");
    }

    root.innerHTML = markup;
  }, rowMarkup);
}

async function expectRowsToKeepBadgesReadable(page: Page) {
  const rows = page.getByTestId("profile-row");
  await expect(rows).toHaveCount(3);

  for (const row of await rows.all()) {
    await expect(row).toBeVisible();

    const metrics = await row.evaluate((element) => {
      const value = element.querySelector("div > span:first-child");
      const badge = element.querySelector("div > span:nth-child(2)");

      if (!(value instanceof HTMLElement) || !(badge instanceof HTMLElement)) {
        throw new Error("Missing value or badge");
      }

      const rowRect = element.getBoundingClientRect();
      const badgeRect = badge.getBoundingClientRect();

      return {
        rowOverflows: element.scrollWidth > element.clientWidth + 1,
        valueOverflow: getComputedStyle(value).overflowX,
        valueTextOverflow: getComputedStyle(value).textOverflow,
        valueWhiteSpace: getComputedStyle(value).whiteSpace,
        badgeWraps: badge.getClientRects().length > 1,
        badgeWidth: badgeRect.width,
        badgeRightInsideRow: badgeRect.right <= rowRect.right + 1,
        badgeLeftInsideRow: badgeRect.left >= rowRect.left - 1,
      };
    });

    expect(metrics.rowOverflows).toBe(false);
    expect(metrics.valueOverflow).toBe("hidden");
    expect(metrics.valueTextOverflow).toBe("ellipsis");
    expect(metrics.valueWhiteSpace).toBe("nowrap");
    expect(metrics.badgeWraps).toBe(false);
    expect(metrics.badgeWidth).toBeGreaterThan(0);
    expect(metrics.badgeLeftInsideRow).toBe(true);
    expect(metrics.badgeRightInsideRow).toBe(true);
  }
}

test.describe("Hushh user profile badge wrapping proof", () => {
  for (const viewport of [
    { name: "mobile", width: 390, height: 900 },
    { name: "desktop", width: 1440, height: 900 },
  ]) {
    test(`keeps profile confidence badges readable on ${viewport.name}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await renderProfileRowFixture(page);
      await expectRowsToKeepBadgesReadable(page);

      await page.screenshot({
        path: testInfo.outputPath(`profile-badge-wrapping-${viewport.name}.png`),
        fullPage: true,
      });
    });
  }
});
