import Link from "next/link";

export function AccountNav() {
  return (
    <nav aria-label="Account" className="flex justify-end border-b border-zinc-800 px-6 py-3 lg:px-10">
      <Link href="/account" className="rounded-lg px-3 py-2 text-sm font-medium text-orange-300 hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-400">
        Account / Sign in
      </Link>
    </nav>
  );
}
