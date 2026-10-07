"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useContinueAfterAuth, useFacebookOAuth } from "@/hooks/auth.hook";
import { apiErrorMessage } from "@/utils";

const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

declare global {
  interface Window {
    FB?: {
      init: (options: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: {
          authResponse?: { accessToken?: string };
        }) => void,
        options: { scope: string },
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

function loadFacebookSdk(clientId: string) {
  if (window.FB) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: clientId,
        cookie: true,
        xfbml: false,
        version: "v21.0",
      });
      resolve();
    };

    const existing = document.getElementById("facebook-jssdk");
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Facebook could not be loaded")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.onerror = () => reject(new Error("Facebook could not be loaded"));
    document.body.appendChild(script);
  });
}

export default function FacebookLoginButton() {
  const router = useRouter();
  const continueAfterAuth = useContinueAfterAuth();
  const { mutate: facebookLogin, isPending } = useFacebookOAuth();
  const [opening, setOpening] = useState(false);
  const busy = isPending || opening;

  const onClick = async () => {
    if (!appId) {
      toast.add({
        title: "Facebook login is not configured",
        description:
          "Add NEXT_PUBLIC_FACEBOOK_APP_ID and the matching backend app secret to turn this on.",
        type: "error",
      });
      return;
    }

    setOpening(true);
    try {
      await loadFacebookSdk(appId);
      window.FB?.login(
        (response) => {
          const accessToken = response.authResponse?.accessToken;
          if (!accessToken) {
            setOpening(false);
            toast.add({
              title: "Facebook login was cancelled",
              description: "Allow email access in the Facebook window to continue.",
              type: "error",
            });
            return;
          }

          facebookLogin(
            { accessToken },
            {
              onSuccess: async () => {
                toast.add({
                  title: "Logged in successfully",
                  description: "Welcome back",
                  type: "success",
                });
                try {
                  await continueAfterAuth();
                } catch {
                  router.push("/");
                } finally {
                  setOpening(false);
                }
              },
              onError: (error) => {
                setOpening(false);
                toast.add({
                  title: "Facebook login failed",
                  description: apiErrorMessage(error),
                  type: "error",
                });
              },
            },
          );
        },
        { scope: "public_profile,email" },
      );
    } catch (error) {
      setOpening(false);
      toast.add({
        title: "Facebook login failed",
        description:
          error instanceof Error ? error.message : "Facebook could not be loaded",
        type: "error",
      });
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={busy}
      onClick={onClick}
    >
      {busy ? <Spinner /> : null}
      Continue with Facebook
    </Button>
  );
}
