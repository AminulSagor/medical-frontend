"use client";

import { Facebook } from "lucide-react";
import { useEffect, useState } from "react";

type FacebookLoginResponse = {
  authResponse?: {
    accessToken?: string;
  };
  status?: string;
};

declare global {
  interface Window {
    FB?: {
      init: (config: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: FacebookLoginResponse) => void,
        options: { scope: string },
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

type FacebookLoginButtonProps = {
  onSuccess: (accessToken: string) => Promise<void>;
};

const FACEBOOK_SCRIPT_ID = "facebook-jssdk";

export default function FacebookLoginButton({
  onSuccess,
}: FacebookLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

    console.log("Facebook app id from env:", appId);
    console.log("Current origin:", window.location.origin);

    if (!appId) {
      console.error("NEXT_PUBLIC_FACEBOOK_APP_ID is missing");
      return;
    }

    window.fbAsyncInit = function () {
      window.FB?.init({
        appId,
        cookie: true,
        xfbml: false,
        version: "v20.0",
      });

      console.log("Facebook SDK initialized");
    };

    if (document.getElementById(FACEBOOK_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = FACEBOOK_SCRIPT_ID;
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.onerror = () => console.error("Failed to load Facebook SDK");

    document.body.appendChild(script);
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB) {
      console.error("Facebook SDK is not loaded yet");
      return;
    }

    setLoading(true);

    window.FB.login(
      async (response) => {
        console.log("Facebook login response:", response);

        const accessToken = response.authResponse?.accessToken;

        if (!accessToken) {
          setLoading(false);
          console.error("Facebook access token missing");
          return;
        }

        try {
          await onSuccess(accessToken);
        } finally {
          setLoading(false);
        }
      },
      { scope: "email,public_profile" },
    );
  };

  return (
    <button
      type="button"
      onClick={handleFacebookLogin}
      disabled={loading}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-300 bg-white text-[#1877F2] shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Continue with Facebook"
    >
      <Facebook className="h-5 w-5" />
    </button>
  );
}
