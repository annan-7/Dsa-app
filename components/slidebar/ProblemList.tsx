"use client";

import Link from "next/link";
import { cn } from "@/libs/utiles";
import { Badge } from "@/components/ui/Badge";

interface ProblemItem {
	slug: string;
	title: string;
	description: string;
	available?: boolean;
}

interface ProblemListProps {
	patternSlug: string;
	problems: ProblemItem[];
	activePatternSlug: string;
	activeProblemSlug: string;
}

export function ProblemList({ patternSlug, problems, activePatternSlug, activeProblemSlug }: ProblemListProps) {
	const isActivePattern = activePatternSlug === patternSlug;

	return (
		<div className="space-y-2">
			{problems.map((problem) => {
				const active = isActivePattern && activeProblemSlug === problem.slug;
				const available = problem.available !== false;

				if (!available) {
					return (
						<div key={problem.slug} className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 px-3 py-3">
							<div className="flex items-center justify-between gap-2">
								<div>
									<div className="text-sm font-medium text-zinc-400">{problem.title}</div>
									<div className="mt-1 text-xs leading-5 text-zinc-600">{problem.description}</div>
								</div>
								<Badge tone="default">Soon</Badge>
							</div>
						</div>
					);
				}

				return (
					<Link
						key={problem.slug}
						href={`/patterns/${patternSlug}/${problem.slug}`}
						className={cn(
							"group block rounded-2xl border px-3 py-3 transition-all duration-200",
							active
								? "border-orange-500/40 bg-orange-500/10 shadow-[0_0_22px_rgba(249,115,22,0.12)]"
								: "border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900",
						)}
					>
						<div className="flex items-center justify-between gap-2">
							<div>
								<div className={cn("text-sm font-medium transition-colors", active ? "text-zinc-50" : "text-zinc-300")}>
									{problem.title}
								</div>
								<div className="mt-1 text-xs leading-5 text-zinc-500">{problem.description}</div>
							</div>
							<Badge tone={active ? "orange" : "default"}>{active ? "Live" : "Open"}</Badge>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
