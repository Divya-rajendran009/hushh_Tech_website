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

async function expectLabelledBenefitSections(page: Page) {
  const sections = page.locator("section[aria-labelledby]");

  await expect(sections).toHaveCount(5);

  for (let index = 0; index < 5; index += 1) {
    const section = sections.nth(index);
    const headingId = await section.getAttribute("aria-labelledby");

    expect(headingId).toBeTruthy();
    await expect(page.locator(`#${headingId}`)).toBeVisible();
  }
}

test.describe("/benefits labelled section proof", () => {
  for (const viewport of [
    { name: "mobile", width: 390, height: 900 },
    { name: "desktop", width: 1440, height: 1100 },
  ]) {
    test(`keeps benefits content sections labelled on ${viewport.name}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await mockSharedWalletModule(page);

      const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
      await page.goto(`${baseURL}/benefits`);

      await expectLabelledBenefitSections(page);

      await page.screenshot({
        path: testInfo.outputPath(`benefits-landmarks-${viewport.name}.png`),
        fullPage: true,
      });
    });
  }
});
