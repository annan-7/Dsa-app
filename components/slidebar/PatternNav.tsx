"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LayoutGrid, Menu, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { patterns } from "@/data/patterns";
import { cn } from "@/libs/utiles";
import { Badge } from "@/components/ui/Badge";
import { ProblemList } from "@/components/slidebar/ProblemList";

export function PatternNav() {
	const pathname = usePathname();
	const [collapsed, setCollapsed] = useState(false);

	const activePatternSlug = useMemo(() => {
		const segments = pathname.split("/").filter(Boolean);
		return segments[0] === "patterns" ? segments[1] : "two-pointers";
	}, [pathname]);

	const activeProblemSlug = useMemo(() => {
		const segments = pathname.split("/").filter(Boolean);
		return segments[0] === "patterns" ? segments[2] : "three-sum";
	}, [pathname]);

	return (
		<motion.aside
			layout
			className={cn(
				"relative flex w-full flex-col border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r",
				collapsed ? "lg:w-[96px]" : "lg:w-[280px]",
			)}
		>
			<div className="flex items-center justify-between gap-3 border-b border-zinc-800/70 px-4 py-4 lg:px-5">
				<Link href="/" className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400 shadow-[0_0_24px_rgba(249,115,22,0.16)]">
						<Sparkles className="h-5 w-5" />
					</div>
					{!collapsed ? (
						<div>
							<div className="text-sm font-semibold text-zinc-50">DSA Visual</div>
							<div className="text-xs text-zinc-500">Aha-first learning</div>
						</div>
					) : null}
				</Link>
				<button
					type="button"
					onClick={() => setCollapsed((value) => !value)}
					className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800"
					aria-label="Toggle sidebar"
				>
					{collapsed ? <Menu className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
				</button>
			</div>

			<div className="border-b border-zinc-800/70 px-4 py-4 lg:px-5">
				<div className={cn("flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2", collapsed && "lg:justify-center")}>
					<Search className="h-4 w-4 text-zinc-500" />
					{!collapsed ? <span className="text-sm text-zinc-500">Search patterns</span> : null}
				</div>
			</div>

			<div className="flex-1 overflow-y-auto px-3 py-4 lg:px-4">
				<div className="mb-4 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
					<LayoutGrid className="h-3.5 w-3.5" />
					{!collapsed ? <span>Patterns</span> : null}
				</div>
				<div className="space-y-4">
					{patterns.map((pattern) => (
						<section key={pattern.slug} className="space-y-3 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-3">
							<div className={cn("flex items-center justify-between gap-3", collapsed && "lg:flex-col lg:items-start")}>
								<div className="min-w-0">
									<div className="truncate text-sm font-semibold text-zinc-100">{pattern.name}</div>
									{!collapsed ? <p className="mt-1 text-xs leading-5 text-zinc-500">{pattern.description}</p> : null}
								</div>
								{!collapsed ? <Badge tone="orange">{pattern.problems.length}</Badge> : null}
							</div>
							{!collapsed ? (
								<ProblemList
									patternSlug={pattern.slug}
									problems={pattern.problems}
									activePatternSlug={activePatternSlug}
									activeProblemSlug={activeProblemSlug}
								/>
							) : null}
						</section>
					))}
				</div>
			</div>
		</motion.aside>
	);
}
