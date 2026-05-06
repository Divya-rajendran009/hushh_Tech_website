const ENFORCED_CSP_DIRECTIVES = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.plaid.com https://*.plaid.com https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.plaid.com",
  "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com data:",
  "img-src 'self' data: blob: https: http:",
  // Wallet upstream traffic must stay behind same-origin /api proxies to avoid CSP regressions.
  "connect-src 'self' https://*.plaid.com https://*.supabase.co wss://*.supabase.co https://www.google.com https://www.gstatic.com https://www.google-analytics.com https://www.googletagmanager.com https://api.emailjs.com https://generativelanguage.googleapis.com https://*.googleapis.com https://www.walletlink.org wss://www.walletlink.org wss://mainnet.infura.io wss://*.infura.io https://*.seondnsresolve.com https://www.recaptcha.net https://hushhtech-nda-generation-53407187172.us-central1.run.app",
  "frame-src 'self' https://cdn.plaid.com https://*.plaid.com https://www.google.com https://www.gstatic.com https://calendly.com https://www.recaptcha.net https://lookerstudio.google.com https://datastudio.google.com",
  "media-src 'self' blob: data:",
  "worker-src 'self' blob:",
  "child-src 'self' blob: https://cdn.plaid.com https://*.plaid.com",
];

const REPORT_ONLY_CSP_DIRECTIVES = ENFORCED_CSP_DIRECTIVES.map((directive) =>
  directive
    .replace(/ 'unsafe-inline'/g, "")
    .replace(/ 'unsafe-eval'/g, "")
);

export const SECURITY_HEADERS = {
  'Content-Security-Policy': ENFORCED_CSP_DIRECTIVES.join('; '),
  'Content-Security-Policy-Report-Only': REPORT_ONLY_CSP_DIRECTIVES.join('; '),
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'Cross-Origin-Resource-Policy': 'same-site',
  'Origin-Agent-Cluster': '?1',
  'Permissions-Policy': 'camera=(self), microphone=(), geolocation=(self), encrypted-media=(self), accelerometer=(self)',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-DNS-Prefetch-Control': 'on',
  'X-Download-Options': 'noopen',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-XSS-Protection': '1; mode=block',
};

export function applySecurityHeaders(res) {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(name, value);
  }
}
