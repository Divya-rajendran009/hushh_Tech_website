# PR 1374 Visual Proof

Route: `/metrics`

Proof captured with Playwright against a local Vite dev server using the mocked metrics summary payload from `tests/metricsHeaderWrappingVisual.spec.ts`.

Validation:

```bash
npx.cmd playwright test tests/metricsHeaderWrappingVisual.spec.ts
```

Screenshots:

- `metrics-header-wrapping-mobile.png` - mobile `/metrics` layout with analytics headers wrapping without clipping.
- `metrics-header-wrapping-desktop.png` - desktop `/metrics` layout with analytics headers wrapping without clipping.
