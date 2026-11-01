/** Accept only local paths, never protocol-relative URLs or escaped backslashes. */
export function safeCallbackUrl(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\x00-\x1f]/.test(value)) return "/account";
  try {
    const url = new URL(value, "http://local.invalid");
    if (url.origin !== "http://local.invalid" || url.pathname === "/signin" || url.pathname.startsWith("/api/")) return "/account";
    return url.pathname + url.search;
  } catch { return "/account"; }
}
