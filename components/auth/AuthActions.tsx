"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function AuthActions({ action, callbackUrl = "/account" }: { action: "signin" | "signout"; callbackUrl?: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setPending(true);
    setError("");
    try {
      if (action === "signin") {
        await signIn("github", { callbackUrl });
      } else {
        await signOut({ callbackUrl: "/" });
      }
    } catch {
      setError("Unable to connect. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button onClick={submit} disabled={pending} variant="primary"
        className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400">
        {pending ? "Please wait…" : action === "signin" ? "Continue with GitHub" : "Sign out"}
      </Button>
      {error ? <p role="alert" className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
