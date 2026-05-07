import { useEffect, useMemo, useState } from "react";
import { Check, Cookie, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import {
  acceptAllConsentPreferences,
  ConsentCategory,
  ConsentPreferences,
  declineOptionalConsentPreferences,
  getConsentPreferences,
  hasStoredConsentPreferences,
  saveConsentPreferences,
} from "../../services/consent/preferences";

type ConsentPreferenceCenterProps = {
  mode?: "global" | "page";
};

type ConsentItem = {
  id: ConsentCategory;
  title: string;
  description: string;
  required?: boolean;
};

const CONSENT_ITEMS: ConsentItem[] = [
  {
    id: "necessary",
    title: "Necessary",
    description:
      "Required for security, authentication, saved choices, and core site features.",
    required: true,
  },
  {
    id: "analytics",
    title: "Analytics",
    description:
      "Helps us measure page views, feature usage, and site reliability without sending raw query values.",
  },
  {
    id: "personalization",
    title: "Personalization",
    description:
      "Allows remembered product preferences and a more tailored Hushh experience.",
  },
  {
    id: "marketing",
    title: "Marketing",
    description:
      "Allows campaign measurement and marketing improvements across Hushh surfaces.",
  },
];

function PreferenceToggle({
  item,
  checked,
  onChange,
}: {
  item: ConsentItem;
  checked: boolean;
  onChange: (category: ConsentCategory, value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-4 last:border-b-0">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-950">{item.title}</h3>
          {item.required && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-normal text-gray-600">
              Always on
            </span>
          )}
        </div>
        <p className="mt-1 text-sm leading-6 text-gray-600">{item.description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${item.title} consent`}
        disabled={item.required}
        onClick={() => onChange(item.id, !checked)}
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2B8CEE] focus:ring-offset-2 disabled:cursor-not-allowed ${
          checked ? "bg-[#2B8CEE]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute left-0 top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function ConsentPreferenceCenter({
  mode = "global",
}: ConsentPreferenceCenterProps) {
  const [preferences, setPreferences] = useState<ConsentPreferences>(() =>
    getConsentPreferences()
  );
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(mode === "page");

  useEffect(() => {
    if (mode === "global") {
      setIsBannerVisible(!hasStoredConsentPreferences());
    }
  }, [mode]);

  const enabledOptionalCount = useMemo(
    () =>
      CONSENT_ITEMS.filter((item) => !item.required && preferences[item.id])
        .length,
    [preferences]
  );

  const handleToggle = (category: ConsentCategory, value: boolean) => {
    if (category === "necessary") {
      return;
    }

    setPreferences((current) => ({
      ...current,
      [category]: value,
      necessary: true,
    }));
  };

  const handleSave = () => {
    const saved = saveConsentPreferences(preferences);
    setPreferences(saved);
    setIsPanelOpen(false);
    setIsBannerVisible(false);
  };

  const handleAcceptAll = () => {
    const saved = acceptAllConsentPreferences();
    setPreferences(saved);
    setIsPanelOpen(false);
    setIsBannerVisible(false);
  };

  const handleDeclineOptional = () => {
    const saved = declineOptionalConsentPreferences();
    setPreferences(saved);
    setIsPanelOpen(false);
    setIsBannerVisible(false);
  };

  const panel = (
    <div
      className={
        mode === "page"
          ? "mx-auto w-full max-w-3xl"
          : "fixed inset-x-4 bottom-4 z-[120] mx-auto w-auto max-w-2xl"
      }
    >
      <section
        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl"
        aria-label="Consent preference center"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-5">
          <div>
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#2B8CEE]/10 text-[#2B8CEE]">
              <SlidersHorizontal size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-950">
              Consent preference center
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Choose how Hushh may use optional data on this device. Necessary
              settings stay on so the site can work.
            </p>
          </div>
          {mode === "global" && (
            <button
              type="button"
              onClick={() => setIsPanelOpen(false)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
              aria-label="Close consent preferences"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div>
          {CONSENT_ITEMS.map((item) => (
            <PreferenceToggle
              key={item.id}
              item={item}
              checked={preferences[item.id]}
              onChange={handleToggle}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            {enabledOptionalCount} of 3 optional categories enabled.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleDeclineOptional}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-100"
            >
              Decline optional
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-gray-950 px-4 text-sm font-semibold text-white hover:bg-gray-800"
            >
              <Check size={16} />
              Save choices
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#2B8CEE] px-4 text-sm font-semibold text-white hover:bg-[#176fc5]"
            >
              Accept all
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  if (mode === "page") {
    return (
      <main className="min-h-screen bg-white px-4 py-16 sm:px-6">
        {panel}
      </main>
    );
  }

  return (
    <>
      {isBannerVisible && !isPanelOpen && (
        <div className="fixed inset-x-4 bottom-4 z-[110] mx-auto max-w-4xl rounded-lg border border-gray-200 bg-white p-4 shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2B8CEE]/10 text-[#2B8CEE]">
                <Cookie size={20} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-950">
                  Manage your data choices
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  Hushh uses necessary storage for the site to work. You can
                  choose optional analytics, personalization, and marketing.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsPanelOpen(true)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                <ShieldCheck size={16} />
                Customize
              </button>
              <button
                type="button"
                onClick={handleDeclineOptional}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-gray-100 px-4 text-sm font-semibold text-gray-800 hover:bg-gray-200"
              >
                Decline optional
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#2B8CEE] px-4 text-sm font-semibold text-white hover:bg-[#176fc5]"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}
      {isPanelOpen && panel}
    </>
  );
}
