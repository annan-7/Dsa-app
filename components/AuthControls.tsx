import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { Button } from "@/components/ui/Button";

export async function AuthControls() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 border-b border-zinc-800/70 px-6 py-3">
      {session ? (
        <>
          <span className="text-sm text-zinc-400">{session.user?.name ?? session.user?.email ?? "Signed in"}</span>
          <Button asChild size="sm">
            <Link href="/api/auth/signout?callbackUrl=%2F">Sign out</Link>
          </Button>
        </>
      ) : (
        <Button asChild size="sm" variant="primary">
          <Link href="/api/auth/signin?callbackUrl=%2F">Sign in with Google</Link>
        </Button>
      )}
    </div>
  );
}
