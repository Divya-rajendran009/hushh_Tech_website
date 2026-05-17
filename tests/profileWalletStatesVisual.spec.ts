import { expect, test, type Page } from "@playwright/test";

type WalletState = "disabled" | "available" | "loading";
type WalletSurface = "hushh-user-profile" | "investor-profile" | "public-investor-profile";

const walletSupportMessage = "Available on iPhone in Wallet-supported browsers.";
const googleSupportMessage =
  "Google Wallet is temporarily unavailable while we finish the wallet issuer setup.";

const stateLabels: Record<WalletState, string> = {
  disabled: "disabled",
  available: "available",
  loading: "loading",
};

async function mockHushhUserProfileLogic(page: Page, state: WalletState) {
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
          const state = "${state}";
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
            isApplePassLoading: state === "loading",
            isGooglePassLoading: state === "loading",
            nwsResult: null,
            nwsLoading: false,
            isWalletPreviewOpen: false,
            appleWalletSupported: state !== "disabled",
            appleWalletSupportMessage: "${walletSupportMessage}",
            googleWalletSupported: state !== "disabled",
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

async function mockInvestorProfileLogic(page: Page, state: WalletState) {
  await page.route("**/src/pages/investor-profile/logic.ts*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/javascript",
      body: `
        export function useInvestorProfileLogic() {
          const state = "${state}";
          return {
            step: "complete",
            isProcessing: false,
            profile: null,
            error: null,
            userData: null,
            isApplePassLoading: state === "loading",
            isGooglePassLoading: state === "loading",
            isWalletPreviewOpen: false,
            appleWalletSupported: state !== "disabled",
            appleWalletSupportMessage: "${walletSupportMessage}",
            googleWalletSupported: state !== "disabled",
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

async function mockPublicInvestorProfile(page: Page, state: WalletState) {
  const neverSettles = "new Promise(() => {})";

  await page.route("**/src/components/hushh-tech-back-header/HushhTechBackHeader.tsx*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/javascript",
      body: "export default function HushhTechBackHeader() { return null; }",
    });
  });

  await page.route("**/src/components/InvestorChatWidget.tsx*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/javascript",
      body: "export function InvestorChatWidget() { return null; }",
    });
  });

  await page.route("**/src/utils/useFooterVisibility.ts*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/javascript",
      body: "export function useFooterVisibility() { return undefined; }",
    });
  });

  await page.route("**/src/services/investorProfile**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/javascript",
      body: `
        export async function createInvestorProfile() { return null; }
        export async function updateInvestorProfile() { return null; }
        export async function fetchInvestorProfile() { return null; }
        export async function fetchPublicInvestorProfileBySlug(slug) {
          return {
            slug,
            profile_url: "https://hushhtech.com/investor/" + slug,
            is_confirmed: true,
            basic_info: {
              name: "Ada Lovelace",
              email: "a***a@example.com",
              age: 36,
              organisation: "Hushh",
            },
            investor_profile: null,
            onboarding_data: null,
            shadow_profile: null,
          };
        }
      `,
    });
  });

  await page.route("**/src/services/walletPass.ts*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/javascript",
      body: `
        export const APPLE_WALLET_SUPPORT_MESSAGE = "${walletSupportMessage}";
        export const GOOGLE_WALLET_SUPPORT_MESSAGE = "${googleSupportMessage}";
        export const isAppleWalletSupported = () => "${state}" !== "disabled";
        export const fetchGoogleWalletAvailability = async () => ({
          available: "${state}" !== "disabled",
          message: "${googleSupportMessage}",
          provider: "${state}" === "disabled" ? "none" : "google",
        });
        export const buildGoldPassPreviewModel = () => null;
        export const downloadHushhGoldPass = () => ${neverSettles};
        export const launchGoogleWalletPass = () => ${neverSettles};
      `,
    });
  });

  await page.route("**/api/send-email-notification", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "{}",
    });
  });
}

async function renderComponent(page: Page, surface: WalletSurface, state: WalletState) {
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
  const componentImport =
    surface === "hushh-user-profile"
      ? "/src/pages/hushh-user-profile/ui.tsx"
      : surface === "investor-profile"
        ? "/src/pages/investor-profile/ui.tsx"
        : "/src/pages/investor/PublicInvestorProfile.tsx";

  if (surface === "hushh-user-profile") {
    await mockHushhUserProfileLogic(page, state);
  } else if (surface === "investor-profile") {
    await mockInvestorProfileLogic(page, state);
  } else {
    await mockPublicInvestorProfile(page, state);
  }

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
          const profileModule = await import("${componentImport}");
          const ProfileComponent = "${surface}" === "public-investor-profile"
            ? profileModule.PublicInvestorWalletActions
            : profileModule.default;

          const element = "${surface}" === "public-investor-profile"
            ? React.createElement(ProfileComponent, {
                isApplePassLoading: "${state}" === "loading",
                isGooglePassLoading: "${state}" === "loading",
                appleWalletSupported: "${state}" !== "disabled",
                googleWalletSupported: "${state}" !== "disabled",
                googleWalletSupportMessage: "${googleSupportMessage}",
                onAppleWalletPass: () => {},
                onGoogleWalletPass: () => {},
              })
            : React.createElement(ProfileComponent);

          createRoot(document.getElementById("root")).render(
            React.createElement(
              ChakraProvider,
              { theme },
              React.createElement(
                MemoryRouter,
                { initialEntries: ["/"] },
                element
              )
            )
          );
        } catch (error) {
          document.body.textContent = error instanceof Error ? error.message : String(error);
        }
      })();
    </script>
  `);

  if (surface === "public-investor-profile") {
    await expect(page.getByTestId("public-investor-wallet-action-controls")).toBeVisible();
  }
}

function controlsFor(page: Page, surface: WalletSurface) {
  if (surface === "hushh-user-profile") {
    return page.getByTestId("hushh-wallet-action-controls");
  }
  if (surface === "investor-profile") {
    return page.getByTestId("investor-wallet-action-controls");
  }
  return page.getByTestId("public-investor-wallet-action-controls");
}

async function expectWalletState(page: Page, surface: WalletSurface, state: WalletState) {
  const controls = controlsFor(page, surface);
  await expect(controls).toBeVisible();
  await controls.scrollIntoViewIfNeeded();

  const buttons = controls.getByRole("button");
  await expect(buttons).toHaveCount(2);

  if (state === "disabled") {
    await expect(buttons.nth(0)).toBeDisabled();
    await expect(buttons.nth(1)).toBeDisabled();
  } else if (state === "available") {
    await expect(buttons.nth(0)).toBeEnabled();
    await expect(buttons.nth(1)).toBeEnabled();
  } else {
    await expect(buttons.nth(0)).toBeDisabled();
    await expect(buttons.nth(1)).toBeDisabled();
    if (surface !== "investor-profile") {
      await expect(controls).toContainText("Loading");
    }
  }

  const metrics = await controls.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const buttons = Array.from(element.querySelectorAll("button"));

    return {
      overflows: element.scrollWidth > element.clientWidth + 1,
      width: rect.width,
      buttonWidths: buttons.map((button) => button.getBoundingClientRect().width),
    };
  });

  expect(metrics.overflows).toBe(false);
  expect(metrics.width).toBeGreaterThan(0);
  expect(metrics.buttonWidths.every((width) => width > 0)).toBe(true);
}

test.describe("profile wallet action states", () => {
  for (const viewport of [
    { name: "mobile", width: 390, height: 900 },
    { name: "desktop", width: 1440, height: 900 },
  ]) {
    for (const surface of [
      "hushh-user-profile",
      "investor-profile",
      "public-investor-profile",
    ] as const) {
      for (const state of ["disabled", "available", "loading"] as const) {
        test(`${surface} ${stateLabels[state]} wallet actions on ${viewport.name}`, async ({
          page,
        }, testInfo) => {
          await page.setViewportSize(viewport);
          await renderComponent(page, surface, state);
          await expectWalletState(page, surface, state);

          await controlsFor(page, surface).screenshot({
            path: testInfo.outputPath(`${surface}-wallet-actions-${state}-${viewport.name}.png`),
          });
        });
      }
    }
  }
});
