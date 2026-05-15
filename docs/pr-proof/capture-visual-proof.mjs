import { chromium } from "playwright";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";

const server = await createServer({
  root: process.cwd(),
  configFile: false,
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 0,
  },
});

await server.listen();

try {
  const baseUrl = server.resolvedUrls?.local[0];

  if (!baseUrl) {
    throw new Error("Vite did not expose a local proof server URL.");
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 720, height: 420 },
    deviceScaleFactor: 1,
  });

  await page.goto(
    new URL("docs/pr-proof/pr-1291/wallet-disabled-proof.html", baseUrl).toString(),
    { waitUntil: "networkidle" }
  );
  await page.locator('[data-testid="wallet-disabled-proof"]').screenshot({
    path: "docs/pr-proof/pr-1291/wallet-disabled-muted-state.png",
  });

  await browser.close();
} finally {
  await server.close();
}
