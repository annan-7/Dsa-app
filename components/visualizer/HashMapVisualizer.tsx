"use client";

import { motion } from "framer-motion";
import type { AlgorithmStep } from "@/libs/types";
import { cn } from "@/libs/utiles";

interface HashMapVisualizerProps {
	step: AlgorithmStep;
}

export function HashMapVisualizer({ step }: HashMapVisualizerProps) {
	const entries = step.hashMap ?? [];

	return (
		<div className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/90 p-5 shadow-xl shadow-black/20">
			<div className="flex items-center justify-between gap-3">
				<div>
					<p className="text-sm font-semibold text-zinc-100">Hash map state</p>
					<p className="mt-1 text-xs uppercase tracking-[0.28em] text-zinc-500">Seen complements</p>
				</div>
				<div className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
					{entries.length ? `${entries.length} entries` : "Empty"}
				</div>
			</div>

			<div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{entries.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/60 px-4 py-8 text-center text-sm text-zinc-600 sm:col-span-2 lg:col-span-3">
						Nothing stored yet.
					</div>
				) : null}
				{entries.map((entry) => {
					const active = entry.highlighted;
					const matched = entry.matched;

					return (
						<motion.div
							key={entry.key}
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: active ? 1.04 : 1, opacity: 1 }}
							transition={{ type: "spring", stiffness: 280, damping: 22 }}
							className={cn(
								"rounded-2xl border px-4 py-4",
								matched
									? "border-emerald-400/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(74,222,128,0.14)]"
									: active
										? "border-orange-400/50 bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.14)]"
										: "border-zinc-800 bg-zinc-900/60",
							)}
						>
							<div className="text-xs uppercase tracking-[0.28em] text-zinc-500">Key</div>
							<div className="mt-2 text-lg font-semibold text-zinc-100">{entry.key}</div>
							<div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300">
								{entry.value}
							</div>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
