import { useEffect } from "react";
import { getStoredConsent } from "../../hooks/useConsent";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

const ConsentScriptLoader = () => {
  useEffect(() => {
    const hasConsent = getStoredConsent();

    if (!hasConsent || !GA_MEASUREMENT_ID) {
      return;
    }

    const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.async = true;
    script.dataset.consentManaged = "true";
    document.head.appendChild(script);

    const win = window as Window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };

    win.dataLayer = win.dataLayer || [];
    win.gtag = (...args: unknown[]) => {
      win.dataLayer?.push(args);
    };

    win.gtag("js", new Date());
    win.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
    });
  }, []);

  return null;
};

export default ConsentScriptLoader;