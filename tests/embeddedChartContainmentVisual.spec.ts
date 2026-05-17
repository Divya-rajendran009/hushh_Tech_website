import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

const proofDir = path.join(process.cwd(), "docs", "pr-proof", "pr-1285");

const summaryPayload = {
  generatedAt: "2026-05-11T12:00:00.000Z",
  timezone: "America/Los_Angeles",
  window: {
    days: 7,
    startDate: "2026-05-05",
    endDate: "2026-05-11",
  },
  businessFunnel: {
    source: "supabase",
    overview: {
      signups: 42,
      persistedUsers: 36,
      onboardingStarted: 28,
      onboardingCompleted: 19,
      profilesCreated: 17,
      profilesConfirmed: 13,
    },
    conversionRates: {
      signupToPersistedUsers: 0.86,
      signupToOnboardingStarted: 0.67,
      onboardingCompletionRate: 0.68,
      profileConfirmationRate: 0.76,
    },
    onboardingStepBreakdown: [{ step: "step-1", users: 28 }],
    series: [
      {
        date: "2026-05-05",
        signups: 4,
        persistedUsers: 4,
        onboardingStarted: 3,
        onboardingCompleted: 2,
        profilesCreated: 2,
        profilesConfirmed: 1,
      },
      {
        date: "2026-05-06",
        signups: 7,
        persistedUsers: 6,
        onboardingStarted: 5,
        onboardingCompleted: 3,
        profilesCreated: 3,
        profilesConfirmed: 2,
      },
      {
        date: "2026-05-07",
        signups: 6,
        persistedUsers: 5,
        onboardingStarted: 4,
        onboardingCompleted: 3,
        profilesCreated: 2,
        profilesConfirmed: 2,
      },
      {
        date: "2026-05-08",
        signups: 8,
        persistedUsers: 7,
        onboardingStarted: 5,
        onboardingCompleted: 4,
        profilesCreated: 4,
        profilesConfirmed: 3,
      },
      {
        date: "2026-05-09",
        signups: 5,
        persistedUsers: 4,
        onboardingStarted: 3,
        onboardingCompleted: 2,
        profilesCreated: 2,
        profilesConfirmed: 2,
      },
      {
        date: "2026-05-10",
        signups: 6,
        persistedUsers: 5,
        onboardingStarted: 4,
        onboardingCompleted: 3,
        profilesCreated: 2,
        profilesConfirmed: 1,
      },
      {
        date: "2026-05-11",
        signups: 6,
        persistedUsers: 5,
        onboardingStarted: 4,
        onboardingCompleted: 2,
        profilesCreated: 2,
        profilesConfirmed: 2,
      },
    ],
  },
  audience: {
    source: "site",
    dau: 18,
    wau: 64,
    mau: 180,
    sessions: 92,
    pageViews: 320,
    events: 540,
  },
  search: {
    totalSearches: 22,
    resultClickRate: 0.44,
    noResultRate: 0.08,
    bySurface: [],
  },
  searchPerformance: {
    source: "search-console",
    available: true,
    realtime: false,
    dataState: "fresh",
    searchType: "web",
    overview: {
      clicks: 72,
      impressions: 1280,
      ctr: 0.056,
      averagePosition: 5.2,
    },
    queries: [{ query: "hushh", clicks: 25, impressions: 410, ctr: 0.061, averagePosition: 3 }],
    pages: [{ pageUrl: "/metrics", clicks: 13, impressions: 190, ctr: 0.068, averagePosition: 4 }],
    countries: [{ country: "US", clicks: 31, impressions: 500, ctr: 0.062, averagePosition: 4 }],
    devices: [{ device: "mobile", clicks: 20, impressions: 340, ctr: 0.059, averagePosition: 6 }],
    searchAppearance: [{ appearance: "Web result", clicks: 8, impressions: 120, ctr: 0.067, averagePosition: 7 }],
    state: {
      source: "ga4",
      available: true,
      byRegion: [{ state: "California", activeUsers: 9, sessions: 18 }],
    },
  },
  gcp: {
    source: "monitoring",
    available: true,
    services: [],
    requestCount: 240,
    errorRate: 0.01,
    p50LatencyMs: 110,
    p95LatencyMs: 220,
    instanceCount: 2,
    uptimeAvailability: 0.995,
  },
  traffic: {
    source: "GA4 Data API",
    available: true,
    overview: {
      active1DayUsers: 18,
      active7DayUsers: 64,
      active28DayUsers: 180,
      sessions: 92,
      engagedSessions: 70,
      screenPageViews: 320,
      newUsers: 27,
      engagementRate: 0.76,
      averageSessionDuration: 126,
      realtimeActiveUsers: 4,
    },
    series: [
      { date: "2026-05-05", activeUsers: 9, sessions: 18, screenPageViews: 48, engagedSessions: 14, newUsers: 4 },
      { date: "2026-05-06", activeUsers: 12, sessions: 20, screenPageViews: 55, engagedSessions: 15, newUsers: 5 },
      { date: "2026-05-07", activeUsers: 10, sessions: 17, screenPageViews: 42, engagedSessions: 12, newUsers: 3 },
      { date: "2026-05-08", activeUsers: 15, sessions: 24, screenPageViews: 63, engagedSessions: 19, newUsers: 6 },
      { date: "2026-05-09", activeUsers: 11, sessions: 16, screenPageViews: 39, engagedSessions: 11, newUsers: 2 },
      { date: "2026-05-10", activeUsers: 13, sessions: 21, screenPageViews: 51, engagedSessions: 16, newUsers: 4 },
      { date: "2026-05-11", activeUsers: 18, sessions: 29, screenPageViews: 72, engagedSessions: 23, newUsers: 3 },
    ],
  },
  legacy: {
    source: "legacy",
    available: true,
    overview: { usersCreated: 8 },
    series: [{ date: "2026-05-11", usersCreated: 8 }],
  },
  dataQualityWarnings: ["GA4 supporting metrics are using the latest cached payload."],
};

async function mockSharedRoutes(page: Page) {
  await page.route("https://fonts.googleapis.com/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/css",
      body: "",
    });
  });

  await page.route("https://fonts.gstatic.com/**", async (route) => {
    await route.fulfill({ status: 404, body: "" });
  });

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

  await page.route("**/api/metrics/summary?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(summaryPayload),
    });
  });

  await page.route("https://gamma.app/embed/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<!doctype html><html><body><main>Gamma presentation embed</main></body></html>",
    });
  });

  await page.route("**/storage/v1/object/public/website/market-updates/dmu10apr/**", async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname.endsWith("/1.png")) {
      await route.fulfill({
        status: 200,
        contentType: "image/png",
        body: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPnyfwAJ9AP2fTV9VQAAAABJRU5ErkJggg==",
          "base64"
        ),
      });
      return;
    }

    await route.fulfill({ status: 404, body: "" });
  });
}

async function expectNoPageOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.viewport + 1);
}

test.describe("PR 1285 embedded content containment proof", () => {
  test.setTimeout(90_000);

  for (const viewport of [
    { name: "mobile", width: 390, height: 900 },
    { name: "desktop", width: 1440, height: 1100 },
  ]) {
    test(`captures /metrics chart containment on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await mockSharedRoutes(page);

      const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
      await page.goto(`${baseURL}/metrics`, { waitUntil: "domcontentloaded" });

      const frames = page.locator(".overscroll-x-contain");
      await expect(frames.first()).toBeVisible();
      await expectNoPageOverflow(page);

      await page.screenshot({
        path: path.join(proofDir, `metrics-chart-containment-${viewport.name}.png`),
        fullPage: true,
      });
    });

    test(`captures Gamma embed containment on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await mockSharedRoutes(page);

      const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
      await page.goto(`${baseURL}/community/general/renaissance-ai-first-fund`, {
        waitUntil: "domcontentloaded",
      });

      await expect(page.getByTitle("Renaissance AI First Fund | Hushh Fund A")).toBeVisible();
      await expectNoPageOverflow(page);

      await page.screenshot({
        path: path.join(proofDir, `gamma-embed-containment-${viewport.name}.png`),
        fullPage: true,
      });
    });

    test(`captures market gallery containment on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await mockSharedRoutes(page);

      const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
      await page.goto(`${baseURL}/community/daily-market-update/10-apr-2025`, {
        waitUntil: "domcontentloaded",
      });

      await expect(page.getByRole("heading", { name: "Supporting Charts & Data" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Open market analysis chart 1" })).toBeVisible();
      await expectNoPageOverflow(page);

      await page.screenshot({
        path: path.join(proofDir, `market-gallery-containment-${viewport.name}.png`),
        fullPage: true,
      });
    });
  }
});
