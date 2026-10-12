"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useContinueAfterAuth, useGoogleOAuth } from "@/hooks/auth.hook";
import { apiErrorMessage } from "@/utils";

export default function GoogleLoginComponent({
  theme = "outline",
  masked = false,
}: {
  theme?: "outline" | "filled_blue" | "filled_black";
  masked?: boolean;
}) {
  const router = useRouter();
  const continueAfterAuth = useContinueAfterAuth();

  const { mutate: googleLogin } = useGoogleOAuth();

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      toast.add({
        title: "Google OAuth Failed",
        description: "Something went wrong. Please try again",
        type: "error",
      });
      return;
    }

    googleLogin(
      { idToken },
      {
        onSuccess: async () => {
          toast.add({
            title: "Logged in Successfully",
            description: "Welcome back",
            type: "success",
          });

          try {
            await continueAfterAuth();
          } catch {
            router.push("/");
          }
        },
        onError: (err) => {
          toast.add({
            title: "Google OAuth Failed",
            description: apiErrorMessage(err),
            type: "error",
          });
        },
      },
    );
  };

  const handleGoogleError = () => {
    toast.add({
      title: "Google OAuth Failed",
      description: "Something went wrong. Please try again",
      type: "error",
    });
  };

  const button = (
    <GoogleLogin
      theme={theme}
      shape="pill"
      text="continue_with"
      width={240}
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
    />
  );

  if (!masked) {
    return button;
  }

  return (
    <div className="relative h-10 overflow-hidden rounded-full">
      <div className="pointer-events-none flex h-10 items-center justify-center gap-2 rounded-full border border-[#245864] bg-[#132f38] text-sm text-white">
        <span className="text-base font-semibold text-[#ea4335]" aria-hidden="true">
          G
        </span>
        Google
      </div>
      <div className="absolute inset-0 z-10 overflow-hidden opacity-0">{button}</div>
    </div>
  );
}
