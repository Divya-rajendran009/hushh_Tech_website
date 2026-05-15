import React from "react";
import { createRoot } from "react-dom/client";

import "../../../src/index.css";
import { HushhUserProfileWalletActions } from "../../../src/pages/hushh-user-profile/WalletActions";

function WalletDisabledProof() {
  return (
    <main
      data-testid="wallet-disabled-proof"
      style={{
        background: "#fffaf0",
        border: "1px solid #e8dfcb",
        color: "#111",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        minHeight: 420,
        padding: 40,
        width: 720,
      }}
    >
      <h1 style={{ fontSize: 30, lineHeight: 1.1, margin: 0 }}>
        Wallet disabled muted state
      </h1>
      <p
        style={{
          color: "#5f5748",
          lineHeight: 1.5,
          margin: "10px 0 30px",
          maxWidth: 590,
        }}
      >
        Live render of the Hushh user profile wallet action component with both
        wallet providers unsupported.
      </p>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 24,
          maxWidth: 390,
          padding: 20,
        }}
      >
        <HushhUserProfileWalletActions
          isApplePassLoading={false}
          isGooglePassLoading={false}
          appleWalletSupported={false}
          googleWalletSupported={false}
          appleWalletSupportMessage="Apple Wallet unavailable"
          googleWalletSupportMessage="Google Wallet unavailable"
          onAppleWalletPass={() => undefined}
          onGoogleWalletPass={() => undefined}
        />
      </div>
      <p
        style={{
          color: "#5f5748",
          fontSize: 14,
          lineHeight: 1.5,
          marginTop: 22,
        }}
      >
        The screenshot is produced from the same React component imported by
        the profile page, not a hand-built HTML approximation.
      </p>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletDisabledProof />
  </React.StrictMode>
);
