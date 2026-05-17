# PR 1291 Visual Proof

Surface: wallet action disabled, available, and loading states on Hushh user profile, investor profile, and public investor profile UI.

Proof captured with Playwright from the real wallet action components used by the affected profile pages.

Command:

```powershell
npx.cmd playwright test tests/profileWalletStatesVisual.spec.ts
```

Screenshots follow this naming pattern:

- `<surface>-wallet-actions-disabled-mobile.png`
- `<surface>-wallet-actions-disabled-desktop.png`
- `<surface>-wallet-actions-available-mobile.png`
- `<surface>-wallet-actions-available-desktop.png`
- `<surface>-wallet-actions-loading-mobile.png`
- `<surface>-wallet-actions-loading-desktop.png`

Surfaces covered: `hushh-user-profile`, `investor-profile`, and `public-investor-profile`.
