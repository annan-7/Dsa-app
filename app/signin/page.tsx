import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AuthActions } from "@/components/auth/AuthActions";
import { safeCallbackUrl } from "@/libs/auth-redirect";
import { authConfigured, authOptions } from "@/libs/auth";

export const dynamic = "force-dynamic";

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string; callbackUrl?: string }> }) {
  const query = await searchParams;
  const callbackUrl = safeCallbackUrl(query.callbackUrl);
  if (authConfigured && await getServerSession(authOptions)) redirect(callbackUrl);

  return (
    <main className="mx-auto w-full max-w-xl space-y-6 px-6 py-12">
      <h1 className="text-3xl font-semibold text-zinc-50">Sign in to DSA Visual</h1>
      <p className="text-zinc-400">Sign in with GitHub to access algorithm visualizations and your account.</p>
      {query.error ? (
        <p role="alert" className="rounded-xl border border-red-900 bg-red-950/30 p-4 text-red-200">
          Sign-in could not be completed. Please try again. If this continues, contact the site administrator.
        </p>
      ) : null}
      {authConfigured ? <AuthActions action="signin" callbackUrl={callbackUrl} /> : (
        <p role="status" className="rounded-xl border border-zinc-700 p-4 text-zinc-300">
          Sign-in is not available yet. Please try again later. The home page is still available.
        </p>
      )}
      <Link href="/" className="inline-block rounded text-orange-300 underline focus-visible:outline focus-visible:outline-2">Back to home</Link>
    </main>
  );
}
