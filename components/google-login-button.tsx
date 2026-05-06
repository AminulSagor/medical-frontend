"use client";

import { useEffect, useRef } from "react";

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

    console.log("Google client id from env:", clientId);
    console.log("Current origin:", window.location.origin);

    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing");
      return;
    }

    if (renderedRef.current) return;

    const renderGoogleButton = () => {
      console.log("Trying to render Google button");

      if (!buttonRef.current) {
        console.error("Google button ref missing");
        return;
      }

      if (!window.google) {
        console.error("Google script not loaded yet");
        return;
      }

      if (renderedRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          console.log("Google credential response:", response);

          if (!response.credential) {
            console.error("Google credential missing");
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
      console.log("Google button rendered successfully");
    };

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);

    if (existingScript) {
      console.log("Google script already exists");
      renderGoogleButton();
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    script.onerror = () => console.error("Failed to load Google script");

    document.body.appendChild(script);
  }, [onSuccess]);

  return (
    <div className="flex justify-center">
      <div ref={buttonRef} />
    </div>
  );
}
