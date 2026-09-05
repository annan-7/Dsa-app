"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PanelLeftClose, PanelLeftOpen, Search, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { patterns } from "@/data/patterns";
import { cn } from "@/libs/utiles";
import { Badge } from "@/components/ui/Badge";
import { ProblemList } from "@/components/slidebar/ProblemList";

export function PatternNav() {
	const pathname = usePathname();
	const [collapsed, setCollapsed] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const activePatternSlug = useMemo(() => {
		const segments = pathname.split("/").filter(Boolean);
		return segments[0] === "patterns" ? segments[1] : "two-pointers";
	}, [pathname]);

	const activeProblemSlug = useMemo(() => {
		const segments = pathname.split("/").filter(Boolean);
		return segments[0] === "patterns" ? segments[2] : "three-sum";
	}, [pathname]);

	const filteredPatterns = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		if (!query) {
			return patterns;
		}

		return patterns
			.map((pattern) => {
				const patternMatches = `${pattern.name} ${pattern.description}`.toLowerCase().includes(query);
				const matchingProblems = pattern.problems.filter((problem) =>
					`${problem.title} ${problem.description}`.toLowerCase().includes(query),
				);

				return patternMatches ? pattern : { ...pattern, problems: matchingProblems };
			})
			.filter((pattern) => pattern.problems.length > 0);
	}, [searchQuery]);

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
					className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800"
					aria-controls="pattern-navigation"
					aria-expanded={!collapsed}
					aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
					title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
				>
					{collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
				</button>
			</div>

			<div className="border-b border-zinc-800/70 px-4 py-4 lg:px-5">
				<label
					className={cn(
						"flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-3 py-2 transition-colors focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/10",
						collapsed && "lg:justify-center",
					)}
				>
					<Search className="h-4 w-4 text-zinc-500" />
					{!collapsed ? (
						<>
							<input
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								placeholder="Search patterns"
								aria-label="Search patterns and problems"
								className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
							/>
							{searchQuery ? (
								<button
									type="button"
									onClick={() => setSearchQuery("")}
									className="rounded-full p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
									aria-label="Clear search"
									title="Clear search"
								>
									<X className="h-3.5 w-3.5" />
								</button>
							) : null}
						</>
					) : null}
				</label>
			</div>

			<div id="pattern-navigation" className="flex-1 overflow-y-auto px-3 py-4 lg:px-4">
				<div className="mb-4 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
					<LayoutGrid className="h-3.5 w-3.5" />
					{!collapsed ? <span>Patterns</span> : null}
				</div>
				<div className="space-y-4">
					{filteredPatterns.map((pattern) => (
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
					{filteredPatterns.length === 0 ? (
						<div className="rounded-2xl border border-dashed border-zinc-800 px-4 py-6 text-center text-sm text-zinc-500">
							No patterns or problems match &quot;{searchQuery}&quot;.
						</div>
					) : null}
				</div>
			</div>
		</motion.aside>
	);
}
