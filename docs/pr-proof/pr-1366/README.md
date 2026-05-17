# PR 1366 Visual Proof

Route: `/metrics`

Proof captured with Playwright against a local Vite server using the mocked
metrics summary payload from `tests/metricsCardPaddingVisual.spec.ts`.

```bash
npx.cmd playwright test tests/metricsCardPaddingVisual.spec.ts
```

Screenshots:

- `metrics-card-padding-desktop.png` - desktop dashboard card spacing.
- `metrics-card-padding-mobile.png` - mobile dashboard card padding and containment.
