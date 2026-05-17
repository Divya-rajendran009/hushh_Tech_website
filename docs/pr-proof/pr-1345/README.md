# PR 1345 Visual Proof

Surface: `src/pages/hushh-user-profile/ui.tsx` AI preference rows

Proof captured from a temporary local Vite fixture using the same row classes as the authenticated profile preference UI. The fixture uses long preference values plus confidence badges to exercise the badge wrapping and row overflow behavior on mobile and desktop.

Command:

```powershell
npx.cmd playwright test tests/hushhUserProfileBadgeWrappingVisual.spec.ts
```

Screenshots:

- `profile-badge-wrapping-mobile.png` - mobile profile preference rows with truncated labels/values and non-wrapping confidence badges.
- `profile-badge-wrapping-desktop.png` - desktop viewport proof that the same profile rows still read cleanly outside the mobile case.
