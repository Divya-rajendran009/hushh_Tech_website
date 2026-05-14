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

async function focusCareerCtaWithKeyboard(page: Page) {
  const careerCta = page.getByRole("link", { name: "View Open Positions" });
  await expect(careerCta).toBeVisible();

  await expect
    .poll(
      async () => {
        await page.keyboard.press("Tab");

        return careerCta.evaluate(
          (element) => document.activeElement === element,
        );
      },
      { intervals: [50], timeout: 10_000 },
    )
    .toBe(true);

  return careerCta;
}

test.describe("/benefits CTA keyboard focus proof", () => {
  for (const viewport of [
    { name: "mobile", width: 390, height: 900 },
    { name: "desktop", width: 1440, height: 1100 },
  ]) {
    test(`shows a visible focus ring on the benefits CTA at ${viewport.name} width`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await mockSharedWalletModule(page);

      const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
      await page.goto(`${baseURL}/benefits`);

      const careerCta = await focusCareerCtaWithKeyboard(page);

      await expect(careerCta).toHaveCSS("box-shadow", /rgb\(0, 102, 204\)/);

      await page.screenshot({
        path: testInfo.outputPath(`benefits-cta-focus-${viewport.name}.png`),
        fullPage: true,
      });
    });
  }
});
