"use client";

import { useEffect, useRef } from "react";
import { FcGoogle } from "react-icons/fc";

type GoogleCredentialResponse = {
  credential?: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              type?: "standard" | "icon";
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              shape?: "rectangular" | "pill" | "circle" | "square";
            },
          ) => void;
        };
      };
    };
  }
}

type GoogleLoginButtonProps = {
  onSuccess: (idToken: string) => Promise<void>;
};

const GOOGLE_SCRIPT_ID = "google-identity-script";

export default function GoogleLoginButton({
  onSuccess,
}: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      return;
    }

    if (renderedRef.current) return;

    const renderGoogleButton = () => {
      if (!buttonRef.current || !window.google || renderedRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!response.credential) {
            return;
          }

          await onSuccess(response.credential);
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "icon",
        theme: "outline",
        size: "large",
        shape: "square",
      });

      renderedRef.current = true;
    };

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);

    if (existingScript) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;

    document.body.appendChild(script);
  }, [onSuccess]);

  return (
    <div className="flex justify-center">
      <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-gray-300 bg-white">
        <FcGoogle className="h-5 w-5" />

        <div ref={buttonRef} className="absolute inset-0 z-10 opacity-0" />
      </div>
    </div>
  );
}
