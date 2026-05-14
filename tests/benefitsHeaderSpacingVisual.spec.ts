import { expect, test, type Page } from "@playwright/test";

async function mockSharedWalletModule(page: Page) {
  await page.route("**/api/shared/walletPassModel.js", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/javascript",
      body: `
        export const buildGoldPassPayload = () => ({});
        export const buildWalletCardContent = () => ({
          holderName: "Hushh Investor",
          organizationName: "Hushh",
          investmentClass: "Class C",
          membershipId: "hushh-investor",
          email: "investor@hushh.ai",
          passUrl: "https://hushhtech.com",
          profileUrl: null,
        });
      `,
    });
  });
}

test.describe("/benefits section header spacing proof", () => {
  for (const viewport of [
    {
      name: "mobile",
      width: 390,
      height: 900,
      expectedDirection: "column",
      expectedMargin: "20px",
    },
    {
      name: "desktop",
      width: 1440,
      height: 1100,
      expectedDirection: "row",
      expectedMargin: "24px",
    },
  ]) {
    test(`keeps benefits section headers spaced on ${viewport.name}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await mockSharedWalletModule(page);

      const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
      await page.goto(`${baseURL}/benefits`);

      const firstHeader = page
        .locator("section > div")
        .filter({ has: page.getByRole("heading", { level: 2 }) })
        .first();

      await expect(firstHeader).toBeVisible();
      await expect(firstHeader).toHaveCSS("margin-bottom", viewport.expectedMargin);
      await expect(firstHeader).toHaveCSS("flex-direction", viewport.expectedDirection);

      await page.screenshot({
        path: testInfo.outputPath(`benefits-header-spacing-${viewport.name}.png`),
        fullPage: true,
      });
    });
  }
});
