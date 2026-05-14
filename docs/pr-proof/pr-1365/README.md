# PR 1365 Visual Proof

Route: `/benefits`

Proof captured with Playwright against a local Vite server after tabbing to the
Benefits CTA from `tests/benefitsCtaFocusVisual.spec.ts`.

```bash
npx.cmd playwright test tests/benefitsCtaFocusVisual.spec.ts
```

Screenshots:

- `benefits-cta-focus-desktop.png` - desktop keyboard focus ring on the benefits CTA action.
- `benefits-cta-focus-mobile.png` - mobile keyboard focus ring on the benefits CTA action.
