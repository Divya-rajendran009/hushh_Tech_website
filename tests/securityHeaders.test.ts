import { describe, expect, it } from "vitest";

import { SECURITY_HEADERS, applySecurityHeaders } from "../api/shared/securityHeaders.js";

describe("security headers", () => {
  it("defines an enforced CSP with browser hardening directives", () => {
    const csp = SECURITY_HEADERS["Content-Security-Policy"];

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("connect-src 'self'");
    expect(csp).toContain("https://*.supabase.co");
    expect(csp).toContain("https://cdn.plaid.com");
  });

  it("ships a stricter report-only CSP before removing inline and eval allowances", () => {
    const enforced = SECURITY_HEADERS["Content-Security-Policy"];
    const reportOnly = SECURITY_HEADERS["Content-Security-Policy-Report-Only"];

    expect(enforced).toContain("'unsafe-inline'");
    expect(enforced).toContain("'unsafe-eval'");
    expect(reportOnly).not.toContain("'unsafe-inline'");
    expect(reportOnly).not.toContain("'unsafe-eval'");
  });

  it("applies secure browser headers to runtime responses", () => {
    const headers = new Map<string, string>();
    const res = {
      setHeader(name: string, value: string) {
        headers.set(name, value);
      },
    };

    applySecurityHeaders(res);

    expect(headers.get("Strict-Transport-Security")).toBe(
      "max-age=31536000; includeSubDomains; preload"
    );
    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
    expect(headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(headers.get("Permissions-Policy")).toContain("microphone=()");
    expect(headers.get("Cross-Origin-Opener-Policy")).toBe("same-origin-allow-popups");
    expect(headers.get("Cross-Origin-Resource-Policy")).toBe("same-site");
    expect(headers.get("Origin-Agent-Cluster")).toBe("?1");
    expect(headers.get("X-Permitted-Cross-Domain-Policies")).toBe("none");
    expect(headers.get("X-Download-Options")).toBe("noopen");
  });
});
