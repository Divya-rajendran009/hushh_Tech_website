import { expect, test, type Page } from "@playwright/test";

const walletSupportMessage = "Available on iPhone in Wallet-supported browsers.";
const googleSupportMessage =
  "Google Wallet is temporarily unavailable while we finish the wallet issuer setup.";

async function mockHushhUserProfileLogic(page: Page) {
  await page.route("**/src/components/hushh-tech-back-header/HushhTechBackHeader.tsx*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/javascript",
      body: "export default function HushhTechBackHeader() { return null; }",
    });
  });

  await page.route("**/src/components/hushh-tech-footer/HushhTechFooter.tsx*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/javascript",
      body: `
        export const HushhFooterTab = { PROFILE: "profile" };
        export default function HushhTechFooter() { return null; }
      `,
    });
  });

  await page.route("**/src/pages/hushh-user-profile/logic.ts*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/javascript",
      body: `
        export const FIELD_LABELS = {};
        export const VALUE_LABELS = {};
        export function useHushhUserProfileLogic() {
          return {
            form: {
              name: "Ada Lovelace",
              email: "ada@example.com",
              age: 36,
              phoneCountryCode: "+1",
              phoneNumber: "5550100",
              organisation: "Hushh",
              accountType: "",
              selectedFund: "",
              referralSource: "",
              citizenshipCountry: "United States",
              residenceCountry: "United States",
              accountStructure: "",
              legalFirstName: "",
              legalLastName: "",
              addressLine1: "",
              city: "",
              state: "",
              zipCode: "",
              dateOfBirth: "",
              initialInvestmentAmount: "",
            },
            investorProfile: null,
            loading: false,
            loadingSeconds: 0,
            isProcessing: false,
            investorStatus: "idle",
            hasOnboardingData: true,
            isApplePassLoading: false,
            isGooglePassLoading: false,
            nwsResult: null,
            nwsLoading: false,
            isWalletPreviewOpen: false,
            appleWalletSupported: false,
            appleWalletSupportMessage: "${walletSupportMessage}",
            googleWalletSupported: false,
            googleWalletSupportMessage: "${googleSupportMessage}",
            walletPreview: null,
            hasCopied: false,
            onCopy: () => {},
            profileUrl: "https://hushhtech.com/investor/ada",
            navigate: () => {},
            handleChange: () => {},
            handleBack: () => {},
            handleSave: () => {},
            isDirty: false,
            isSaving: false,
            handleSaveChanges: () => {},
            handleAppleWalletPass: () => {},
            handleGoogleWalletPass: () => {},
            COUNTRIES: ["United States"],
            openWalletPreview: () => {},
            closeWalletPreview: () => {},
            editingField: null,
            setEditingField: () => {},
            FIELD_OPTIONS: {},
            MULTI_SELECT_FIELDS: [],
            handleUpdateAIField: () => {},
            handleMultiSelectToggle: () => {},
            getConfidenceLabel: () => "High confidence",
            getConfidenceBadgeClass: () => "border-emerald-200 text-emerald-700",
          };
        }
      `,
    });
  });
}

async function mockInvestorProfileLogic(page: Page) {
  await page.route("**/src/pages/investor-profile/logic.ts*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/javascript",
      body: `
        export function useInvestorProfileLogic() {
          return {
            step: "complete",
            isProcessing: false,
            profile: null,
            error: null,
            userData: null,
            isApplePassLoading: false,
            isGooglePassLoading: false,
            isWalletPreviewOpen: false,
            appleWalletSupported: false,
            appleWalletSupportMessage: "${walletSupportMessage}",
            googleWalletSupported: false,
            googleWalletSupportMessage: "${googleSupportMessage}",
            profileUrl: "https://hushhtech.com/investor/ada",
            walletPreview: null,
            handleFormSubmit: () => {},
            handleProfileConfirm: () => {},
            handleCopyURL: () => {},
            handleShare: () => {},
            handleAppleWalletDownload: () => {},
            handleGoogleWalletDownload: () => {},
            openWalletPreview: () => {},
            closeWalletPreview: () => {},
          };
        }
      `,
    });
  });
}

async function prepareProfileRoutes(page: Page) {
  await mockHushhUserProfileLogic(page);
  await mockInvestorProfileLogic(page);
}

async function renderProfileComponent(page: Page, component: "hushh" | "investor") {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
  const componentImport =
    component === "hushh"
      ? "/src/pages/hushh-user-profile/ui.tsx"
      : "/src/pages/investor-profile/ui.tsx";
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await page.setContent(`
    <div id="root"></div>
    <script type="module">
      (async () => {
        try {
          await import("/src/index.css");
          const React = (await import("/node_modules/.vite/deps/react.js")).default;
          const { createRoot } = (await import("/node_modules/.vite/deps/react-dom_client.js")).default;
          const { ChakraProvider } = await import("/node_modules/.vite/deps/@chakra-ui_react.js");
          const { MemoryRouter } = await import("/node_modules/.vite/deps/react-router-dom.js");
          const { default: theme } = await import("/src/theme/index.ts");
          const { default: ProfileComponent } = await import("${componentImport}");

          createRoot(document.getElementById("root")).render(
            React.createElement(
              ChakraProvider,
              { theme },
              React.createElement(
                MemoryRouter,
                { initialEntries: ["/"] },
                React.createElement(ProfileComponent)
              )
            )
          );
        } catch (error) {
          document.body.textContent = error instanceof Error ? error.message : String(error);
        }
      })();
    </script>
  `);
}

async function expectHushhControls(page: Page, stacked: boolean) {
  const controls = page.getByTestId("wallet-action-controls");
  await expect(controls).toBeVisible();
  await controls.scrollIntoViewIfNeeded();

  const metrics = await controls.evaluate((element) => {
    const styles = getComputedStyle(element);
    const buttons = Array.from(element.querySelectorAll("button"));

    return {
      display: styles.display,
      gap: styles.gap,
      columns: styles.gridTemplateColumns.split(" ").filter(Boolean).length,
      buttonWidths: buttons.map((button) => button.getBoundingClientRect().width),
    };
  });

  expect(metrics.display).toBe("grid");
  expect(metrics.columns).toBe(stacked ? 1 : 2);
  expect(metrics.buttonWidths.every((width) => width > 0)).toBe(true);
}

async function expectInvestorControls(page: Page, stacked: boolean) {
  const controls = page.getByTestId("investor-wallet-action-controls");
  await expect(controls).toBeVisible();
  await controls.scrollIntoViewIfNeeded();

  const metrics = await controls.evaluate((element) => {
    const styles = getComputedStyle(element);
    const buttons = Array.from(element.querySelectorAll("button"));

    return {
      display: styles.display,
      flexDirection: styles.flexDirection,
      gap: styles.gap,
      buttonWidths: buttons.map((button) => button.getBoundingClientRect().width),
      controlWidth: element.getBoundingClientRect().width,
    };
  });

  expect(metrics.display).toBe("flex");
  expect(metrics.flexDirection).toBe(stacked ? "column" : "row");
  expect(metrics.buttonWidths.every((width) => width > 0)).toBe(true);

  if (stacked) {
    expect(metrics.buttonWidths.every((width) => width >= metrics.controlWidth - 2)).toBe(true);
  }
}

test.describe("profile wallet action responsiveness", () => {
  for (const viewport of [
    { name: "mobile", width: 360, height: 900, stacked: true },
    { name: "desktop", width: 1440, height: 900, stacked: false },
  ]) {
    test(`captures Hushh user profile wallet actions on ${viewport.name}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await prepareProfileRoutes(page);
      await renderProfileComponent(page, "hushh");
      await expectHushhControls(page, viewport.stacked);

      await page.getByTestId("wallet-action-controls").screenshot({
        path: testInfo.outputPath(`hushh-user-profile-wallet-actions-${viewport.name}.png`),
      });
    });

    test(`captures investor profile wallet actions on ${viewport.name}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await prepareProfileRoutes(page);
      await renderProfileComponent(page, "investor");
      await expectInvestorControls(page, viewport.stacked);

      await page.getByTestId("investor-wallet-action-controls").screenshot({
        path: testInfo.outputPath(`investor-profile-wallet-actions-${viewport.name}.png`),
      });
    });
  }
});
