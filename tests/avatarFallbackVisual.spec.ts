import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

const proofDir = path.join(process.cwd(), "docs", "pr-proof", "pr-1265");

const authUser = {
  id: "avatar-user-1",
  aud: "authenticated",
  role: "authenticated",
  email: "avatar.fallback@example.com",
  user_metadata: {
    full_name: "Avery Fallback",
    name: "Avery Fallback",
    avatar_url: null,
    picture: null,
  },
};

const authSession = {
  access_token: "avatar-proof-token",
  refresh_token: "avatar-proof-refresh",
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: "bearer",
  user: authUser,
};

async function seedAuthenticatedSession(page: Page) {
  await page.addInitScript((session) => {
    window.localStorage.setItem("sb-example-auth-token", JSON.stringify(session));
    window.sessionStorage.setItem("hushh_ai_auth_cached", "true");
    window.sessionStorage.setItem("hushh_ai_has_visited", "true");
    window.sessionStorage.setItem(
      "hushh_ai_profile",
      JSON.stringify({
        data: {
          email: "avatar.fallback@example.com",
          displayName: "Avery Fallback",
          avatarUrl: null,
        },
        timestamp: Date.now(),
      })
    );
  }, authSession);
}

async function mockSharedRoutes(page: Page) {
  await page.route("https://fonts.googleapis.com/**", async (route) => {
    await route.fulfill({ status: 200, contentType: "text/css", body: "" });
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
          holderName: "Avery Fallback",
          organizationName: "Hushh",
          investmentClass: "Class C",
          membershipId: "avery-fallback",
          email: "avatar.fallback@example.com",
          passUrl: "https://hushhtech.com",
          profileUrl: null,
        });
      `,
    });
  });

  await page.route("**/api/public-investor-profile?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        slug: "avery-fallback",
        profile_url: "https://hushhtech.com/investor/avery-fallback",
        is_confirmed: true,
        basic_info: {
          name: "Avery Fallback",
          email: "a***k@example.com",
          age: 34,
          organisation: "Hushh",
        },
        investor_profile: null,
        onboarding_data: null,
        shadow_profile: null,
      }),
    });
  });

  await page.route("https://hushh-api-53407187172.us-central1.run.app/api/check-user?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user: {
          hushh_id: "hushh-avatar-proof",
          name: "Avery Fallback",
          city: "San Francisco",
          country: "United States",
          email: "avatar.fallback@example.com",
          user_coins: 12,
          dob: "1992-05-01",
          phone_number: "5550100",
          reason_for_using_hushhTech: "Profile proof",
          accountCreation: "2026-05-01T00:00:00.000Z",
          onboard_status: "active",
        },
      }),
    });
  });

  await page.route("https://example.supabase.co/auth/v1/user", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(authUser),
    });
  });

  await page.route("https://example.supabase.co/auth/v1/token?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(authSession),
    });
  });

  await page.route("https://example.supabase.co/rest/v1/hushh_ai_users?**", async (route) => {
    const method = route.request().method();
    const user = {
      id: "hushh-ai-user-1",
      supabase_user_id: authUser.id,
      email: authUser.email,
      display_name: "Avery Fallback",
      avatar_url: null,
      created_at: "2026-05-01T00:00:00.000Z",
      last_login_at: "2026-05-11T00:00:00.000Z",
      total_messages: 0,
      total_chats: 0,
      is_active: true,
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(method === "PATCH" ? user : [user]),
    });
  });

  await page.route("https://example.supabase.co/rest/v1/rpc/check_user_nda_status**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        hasSignedNda: true,
        signedAt: "2026-05-01T00:00:00.000Z",
        ndaVersion: "v1.0",
        signerName: "Avery Fallback",
      }),
    });
  });

  await page.route("https://example.supabase.co/rest/v1/hushh_ai_chats?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });

  await page.route("https://example.supabase.co/rest/v1/hushh_ai_media_limits?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user_id: "hushh-ai-user-1",
        daily_uploads: 0,
        last_reset: "2026-05-11T00:00:00.000Z",
      }),
    });
  });

  await page.route("https://example.supabase.co/rest/v1/**", async (route) => {
    if (route.request().url().includes("/rpc/check_user_nda_status")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          hasSignedNda: true,
          signedAt: "2026-05-01T00:00:00.000Z",
          ndaVersion: "v1.0",
          signerName: "Avery Fallback",
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    });
  });
}

async function expectNoPageOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.viewport + 1);
}

async function expectRoundFallback(locator: ReturnType<Page["locator"]>) {
  const fallback = locator.first();

  await expect(fallback).toBeVisible();
  await expect(fallback).toHaveCSS("display", "flex");
  await expect(fallback).toHaveCSS("align-items", "center");
  await expect(fallback).toHaveCSS("justify-content", "center");
}

test.describe("PR 1265 missing avatar fallback visual proof", () => {
  test.setTimeout(90_000);

  for (const viewport of [
    { name: "mobile", width: 390, height: 900 },
    { name: "desktop", width: 1440, height: 1100 },
  ]) {
    test(`captures /your-profile fallback on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await seedAuthenticatedSession(page);
      await mockSharedRoutes(page);

      const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
      await page.goto(`${baseURL}/your-profile`, { waitUntil: "domcontentloaded" });

      await expect(page.getByRole("heading", { name: "Avery Fallback" })).toBeVisible();
      await expectRoundFallback(page.locator(".bg-gradient-to-r.rounded-full").filter({ has: page.locator("svg") }));
      await expectNoPageOverflow(page);

      await page.screenshot({
        path: path.join(proofDir, `your-profile-avatar-fallback-${viewport.name}.png`),
        fullPage: true,
      });
    });

    test(`captures public investor fallback on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await mockSharedRoutes(page);

      const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
      await page.goto(`${baseURL}/investor/avery-fallback`, { waitUntil: "domcontentloaded" });

      await expect(page.getByRole("heading", { name: /Avery Fallback/ })).toBeVisible();
      await expectRoundFallback(page.locator(".bg-gray-100.rounded-full").filter({ has: page.locator("svg, .material-symbols-outlined") }));
      await expectNoPageOverflow(page);

      await page.screenshot({
        path: path.join(proofDir, `public-investor-avatar-fallback-${viewport.name}.png`),
        fullPage: true,
      });
    });

    test(`captures Hushh AI fallback on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await seedAuthenticatedSession(page);
      await mockSharedRoutes(page);

      const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";
      await page.goto(`${baseURL}/hushh-ai`, { waitUntil: "domcontentloaded" });

      await expect(page.getByText("Avery Fallback").first()).toBeVisible();
      await expect(page.locator(".chakra-avatar__initials").first()).toHaveCSS("display", "flex");
      await expect(page.locator(".chakra-avatar__initials").first()).toHaveCSS("align-items", "center");
      await expect(page.locator(".chakra-avatar__initials").first()).toHaveCSS("justify-content", "center");
      await expectNoPageOverflow(page);

      await page.screenshot({
        path: path.join(proofDir, `hushh-ai-avatar-fallback-${viewport.name}.png`),
        fullPage: true,
      });
    });
  }
});
