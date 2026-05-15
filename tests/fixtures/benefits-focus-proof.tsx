import React from "react";
import { createRoot } from "react-dom/client";

import "../../src/index.css";
import BenefitsPage from "../../src/pages/benefits";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BenefitsPage />
  </React.StrictMode>
);
