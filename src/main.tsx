import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n";

import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";

const CookiePolicyPage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1020",
        color: "white",
        padding: "80px",
        fontSize: "24px",
      }}
    >
      <h1 style={{ fontSize: "52px" }}>Cookie Policy</h1>
      <p>Last updated: April 2026</p>

      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device to improve website
        performance and user experience.
      </p>

      <h2>How we use cookies</h2>
      <p>
        Hushh may use cookies for security, analytics, preferences, and website
        functionality.
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can manage or disable cookies through your browser settings.
      </p>
    </div>
  );
};

async function renderApp() {
  const root = ReactDOM.createRoot(document.getElementById("root")!);

  if (window.location.pathname === "/cookie-policy") {
    root.render(
      <React.StrictMode>
        <CookiePolicyPage />
      </React.StrictMode>
    );
    return;
  }

  const { default: App } = await import("./App.tsx");

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

renderApp();