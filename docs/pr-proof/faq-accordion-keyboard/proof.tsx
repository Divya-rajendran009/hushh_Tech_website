import React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import FaqPage from "../../../src/pages/faq";
import "../../../src/index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <FaqPage />
    </ChakraProvider>
  </React.StrictMode>,
);
