import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const walletCardActionClassName = [
  "border border-gray-200 rounded-2xl py-3 px-4 flex items-center justify-center gap-2",
  "text-black hover:border-hushh-blue/30 transition-colors",
  "disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:opacity-100 disabled:cursor-not-allowed",
  "disabled:hover:border-gray-200 disabled:hover:bg-gray-100 disabled:active:scale-100",
  "disabled:[&_svg]:grayscale disabled:[&_svg]:opacity-60 disabled:[&_span]:text-gray-400",
].join(" ");

interface HushhUserProfileWalletActionsProps {
  isApplePassLoading: boolean;
  isGooglePassLoading: boolean;
  appleWalletSupported: boolean;
  googleWalletSupported: boolean;
  appleWalletSupportMessage: string;
  googleWalletSupportMessage: string;
  onAppleWalletPass: () => void;
  onGoogleWalletPass: () => void;
}

export function HushhUserProfileWalletActions({
  isApplePassLoading,
  isGooglePassLoading,
  appleWalletSupported,
  googleWalletSupported,
  appleWalletSupportMessage,
  googleWalletSupportMessage,
  onAppleWalletPass,
  onGoogleWalletPass,
}: HushhUserProfileWalletActionsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4" data-testid="hushh-wallet-action-controls">
        <button
          type="button"
          onClick={onAppleWalletPass}
          disabled={isApplePassLoading || !appleWalletSupported}
          className={walletCardActionClassName}
        >
          <FaApple className="text-lg" />
          <span className="text-xs font-medium">
            {isApplePassLoading ? "Loading..." : "Apple Wallet"}
          </span>
        </button>
        <button
          type="button"
          onClick={onGoogleWalletPass}
          disabled={isGooglePassLoading || !googleWalletSupported}
          className={walletCardActionClassName}
        >
          <FcGoogle className="text-lg" />
          <span className="text-xs font-medium">
            {isGooglePassLoading ? "Loading..." : "Google Wallet"}
          </span>
        </button>
      </div>
      {!appleWalletSupported && (
        <p className="mt-3 text-xs text-gray-500 font-light">
          {appleWalletSupportMessage}
        </p>
      )}
      {!googleWalletSupported && (
        <p className="mt-3 text-xs text-gray-500 font-light">
          {googleWalletSupportMessage}
        </p>
      )}
    </>
  );
}
