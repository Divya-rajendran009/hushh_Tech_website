# PR 1295 Visual Proof

Surface: responsive wallet action control layout on the Hushh user profile and investor profile pages.

Proof captured from the actual `/hushh-user-profile` and `/investor-profile` route components with Playwright. The test mocks only route protection and profile data hooks so the affected UI renders from the real page components.

Command:

```powershell
npx.cmd playwright test tests/profileWalletActionsVisual.spec.ts
```

Screenshots:

- `hushh-user-profile-wallet-actions-mobile.png` - mobile Hushh user profile wallet controls stacked at 360px.
- `hushh-user-profile-wallet-actions-desktop.png` - desktop Hushh user profile wallet controls in the wider layout.
- `investor-profile-wallet-actions-mobile.png` - mobile investor profile wallet controls stacked at 360px.
- `investor-profile-wallet-actions-desktop.png` - desktop investor profile wallet controls in the wider layout.
