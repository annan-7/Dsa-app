import { AuthActions } from "@/components/auth/AuthActions";
import { requireAuth } from "@/libs/require-auth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await requireAuth();

  return (
    <main className="mx-auto w-full max-w-xl space-y-6 px-6 py-12">
      <h1 className="text-3xl font-semibold text-zinc-50">Your account</h1>
      <p className="break-words text-zinc-300">Signed in as {session.user.name ?? "GitHub user"}.</p>
      {session.user.email ? <p className="break-words text-zinc-400">{session.user.email}</p> : null}
      <p className="text-zinc-400">Your session is active. Learning progress is not saved to an account yet.</p>
      <AuthActions action="signout" />
    </main>
  );
}
