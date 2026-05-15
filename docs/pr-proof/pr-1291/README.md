# PR 1291 Visual Proof

Surface: disabled Apple Wallet and Google Wallet action styling in `HushhUserProfileWalletActions`.

Proof captured with Playwright from a local Vite proof page that imports the same React component used by `src/pages/hushh-user-profile/ui.tsx`. The surrounding proof frame is only screenshot chrome; the wallet buttons and support messages are rendered by the production component and `src/index.css`.

Screenshots:

- `wallet-disabled-muted-state.png` - disabled wallet controls with muted text and icons while retaining readable opacity.

Recreate:

```bash
node docs/pr-proof/capture-visual-proof.mjs
```
