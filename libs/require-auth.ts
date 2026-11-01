import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfigured, authOptions } from "./auth";
import { safeCallbackUrl } from "./auth-redirect";

export async function requireAuth(callbackUrl = "/account") {
  const session = authConfigured ? await getServerSession(authOptions) : null;
  if (!session?.user) redirect(`/signin?callbackUrl=${encodeURIComponent(safeCallbackUrl(callbackUrl))}`);
  return { ...session, user: session.user };
}
