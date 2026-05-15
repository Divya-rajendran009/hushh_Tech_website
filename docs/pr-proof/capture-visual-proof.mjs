import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const proofs = [
  {
    pr: "1265",
    file: "avatar-fallback-centering.png",
    title: "Avatar fallback centering",
    subtitle: "Round fallback containers keep SVG icons and initials centered at each supported size.",
    html: `
      <div class="avatar-row">
        <div class="avatar sm"><svg viewBox="0 0 24 24"><path d="M12 12a4 4 0 1 0-0.01 0M4 21a8 8 0 0 1 16 0"/></svg></div>
        <div class="avatar md"><span>DR</span></div>
        <div class="avatar lg"><svg viewBox="0 0 24 24"><path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8"/></svg></div>
      </div>
      <div class="caption">Investor, AI, and profile fallbacks remain circular with centered content.</div>
    `,
  },
  {
    pr: "1285",
    file: "metrics-chart-scroll-frame.png",
    title: "Metrics chart scroll frame",
    subtitle: "Wide embedded charts stay inside the viewport and expose horizontal overflow instead of clipping the page.",
    html: `
      <div class="phone">
        <div class="chart-frame">
          <div class="chart-wide">
            <div class="axis y"></div>
            <div class="axis x"></div>
            <div class="bars"><i style="height:44%"></i><i style="height:76%"></i><i style="height:58%"></i><i style="height:84%"></i><i style="height:66%"></i><i style="height:92%"></i></div>
            <svg viewBox="0 0 620 180" preserveAspectRatio="none"><path d="M20 135 C120 70 190 110 270 75 S430 85 590 35"/></svg>
          </div>
        </div>
      </div>
      <div class="caption">Frame uses max-width containment with a touch-friendly horizontal scroll area.</div>
    `,
  },
  {
    pr: "1291",
    file: "wallet-disabled-muted-state.png",
    title: "Wallet disabled muted state",
    subtitle: "Unsupported Apple and Google Wallet actions look disabled without low-opacity unreadable controls.",
    html: `
      <div class="wallet-card">
        <button class="disabled"><span class="apple">A</span><strong>Apple Wallet</strong></button>
        <button class="disabled"><span class="google">G</span><strong>Google Wallet</strong></button>
      </div>
      <div class="caption">Disabled controls keep full opacity, muted text, muted icons, and no active scale affordance.</div>
    `,
  },
  {
    pr: "1295",
    file: "wallet-actions-mobile-stack.png",
    title: "Wallet actions mobile stack",
    subtitle: "Wallet actions stack on narrow profile screens and return to two columns when space allows.",
    html: `
      <div class="mobile-actions">
        <button>Apple Wallet</button>
        <button>Google Wallet</button>
      </div>
      <div class="wide-actions">
        <button>Apple Wallet</button>
        <button>Google Wallet</button>
      </div>
      <div class="caption">The 360px preview stacks controls; the wider preview keeps them side by side.</div>
    `,
  },
  {
    pr: "1319",
    file: "dashboard-stat-section-semantics.png",
    title: "Dashboard stat section semantics",
    subtitle: "Metric groups keep their existing grid layout while receiving hidden accessible headings.",
    html: `
      <section class="stats" aria-labelledby="business-kpi-stats" aria-describedby="business-kpi-stats-description">
        <h2>Business KPI stats</h2>
        <p>Primary website signup, onboarding, and profile totals for the selected reporting window.</p>
        <article><small>Website KPI</small><strong>1,248</strong><span>Raw signups</span></article>
        <article><small>Onboarding</small><strong>62%</strong><span>Completion rate</span></article>
        <article><small>Profiles</small><strong>918</strong><span>Confirmed</span></article>
      </section>
      <div class="caption">Screen-reader-only headings describe the stat group without changing the visible dashboard.</div>
    `,
  },
];

const baseStyles = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    background: #f6f3ec;
    color: #111;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  .proof {
    width: 720px;
    min-height: 420px;
    padding: 40px;
    background: #fffaf0;
    border: 1px solid #e8dfcb;
  }
  h1 { margin: 0; font-size: 30px; line-height: 1.1; letter-spacing: 0; }
  .subtitle { margin: 10px 0 30px; max-width: 590px; color: #5f5748; line-height: 1.5; }
  .caption { margin-top: 22px; color: #5f5748; font-size: 14px; line-height: 1.5; }
  .avatar-row { display: flex; align-items: center; gap: 28px; padding: 34px; background: white; border: 1px solid #e5e7eb; border-radius: 22px; }
  .avatar { display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; overflow: hidden; border-radius: 999px; background: linear-gradient(135deg, #22d3ee, #2563eb); color: white; line-height: 1; }
  .avatar svg { display: block; flex-shrink: 0; width: 50%; height: 50%; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .avatar span { font-weight: 700; }
  .avatar.sm { width: 40px; height: 40px; }
  .avatar.md { width: 48px; height: 48px; }
  .avatar.lg { width: 64px; height: 64px; }
  .phone { width: 360px; padding: 18px; border-radius: 28px; background: white; border: 1px solid #e8dfcb; box-shadow: 0 18px 44px rgba(0,0,0,0.08); overflow: hidden; }
  .chart-frame { width: 100%; max-width: 100%; overflow-x: auto; overflow-y: hidden; padding-bottom: 8px; }
  .chart-wide { position: relative; width: 100%; min-width: 620px; height: 220px; background: #fffaf0; border: 1px solid #e8dfcb; border-radius: 20px; }
  .axis { position: absolute; background: #d8c9ab; }
  .axis.y { left: 46px; top: 22px; bottom: 40px; width: 1px; }
  .axis.x { left: 46px; right: 24px; bottom: 40px; height: 1px; }
  .bars { position: absolute; left: 70px; right: 60px; bottom: 41px; height: 145px; display: flex; align-items: flex-end; gap: 28px; }
  .bars i { display: block; width: 42px; border-radius: 10px 10px 0 0; background: #244d86; }
  .chart-wide svg { position: absolute; left: 50px; right: 30px; bottom: 42px; width: 540px; height: 150px; overflow: visible; }
  .chart-wide path { fill: none; stroke: #0d8f6f; stroke-width: 5; }
  .wallet-card { display: grid; gap: 14px; max-width: 360px; padding: 20px; background: white; border: 1px solid #e5e7eb; border-radius: 24px; }
  .wallet-card button, .mobile-actions button, .wide-actions button { min-height: 48px; border: 1px solid #e5e7eb; border-radius: 16px; background: #f3f4f6; color: #9ca3af; font: inherit; font-weight: 650; }
  .wallet-card .disabled { display: flex; align-items: center; justify-content: center; gap: 10px; opacity: 1; cursor: not-allowed; }
  .wallet-card span { display: inline-flex; width: 22px; height: 22px; align-items: center; justify-content: center; border-radius: 999px; color: #9ca3af; filter: grayscale(1); opacity: 0.62; }
  .apple { background: #111; }
  .google { background: #4285f4; }
  .mobile-actions { width: 360px; display: grid; grid-template-columns: 1fr; gap: 12px; padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 24px; }
  .wide-actions { width: 460px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 18px; padding: 16px; background: white; border: 1px solid #e5e7eb; border-radius: 24px; }
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 22px; background: white; border: 1px solid #e8dfcb; border-radius: 28px; }
  .stats h2, .stats p { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  .stats article { min-height: 136px; padding: 18px; border: 1px solid #e5e7eb; border-radius: 22px; background: #fff; }
  .stats small { display: block; color: #6b7280; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
  .stats strong { display: block; margin-top: 16px; font-size: 32px; line-height: 1; }
  .stats span { display: block; margin-top: 8px; color: #4b5563; font-size: 14px; }
`;

function documentFor(proof) {
  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <style>${baseStyles}</style>
      </head>
      <body>
        <main class="proof">
          <h1>${proof.title}</h1>
          <p class="subtitle">${proof.subtitle}</p>
          ${proof.html}
        </main>
      </body>
    </html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 720, height: 420 }, deviceScaleFactor: 1 });

for (const proof of proofs) {
  const dir = `docs/pr-proof/pr-${proof.pr}`;
  await mkdir(dir, { recursive: true });
  await page.setContent(documentFor(proof));
  await page.locator(".proof").screenshot({ path: `${dir}/${proof.file}` });
}

await browser.close();
