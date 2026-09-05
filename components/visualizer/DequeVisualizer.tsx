"use client";

import { motion } from "framer-motion";
import type { AlgorithmStep, DequeEntry } from "@/libs/types";
import { cn } from "@/libs/utiles";

interface DequeVisualizerProps {
	step: AlgorithmStep;
}

function DequeRow({ label, entries, tone }: { label: string; entries: DequeEntry[]; tone: "orange" | "blue" }) {
	return (
		<div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
			<div className="flex items-center justify-between gap-3">
				<div className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">{label}</div>
				<div className="text-xs text-zinc-600">front to back</div>
			</div>
			<div className="mt-3 flex min-h-16 gap-2 overflow-x-auto pb-1">
				{entries.length === 0 ? (
					<div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-zinc-800 text-xs text-zinc-600">Empty</div>
				) : null}
				{entries.map((entry, index) => (
					<motion.div
						key={`${label}-${entry.index}`}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						className={cn(
							"min-w-16 rounded-xl border px-3 py-2 text-center",
							 tone === "orange" ? "border-orange-400/40 bg-orange-500/10" : "border-blue-400/40 bg-blue-500/10",
						)}
					>
						<div className="text-lg font-semibold tabular-nums text-zinc-100">{entry.value}</div>
						<div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">{index === 0 ? "front" : `#${entry.index}`}</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}

export function DequeVisualizer({ step }: DequeVisualizerProps) {
	return (
		<div className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/90 p-5 shadow-xl shadow-black/20">
			<div className="flex items-center justify-between gap-3">
				<div>
					<p className="text-sm font-semibold text-zinc-100">Monotonic deque state</p>
					<p className="mt-1 text-xs uppercase tracking-[0.28em] text-zinc-500">Candidates that can still win</p>
				</div>
				<div className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
					{(step.deque ?? step.maxDeque ?? []).length} candidate{(step.deque ?? step.maxDeque ?? []).length === 1 ? "" : "s"}
				</div>
			</div>
			<div className="mt-5 grid gap-3 md:grid-cols-2">
				{step.maxDeque || step.minDeque ? (
					<>
						<DequeRow label="Maximum candidates" entries={step.maxDeque ?? []} tone="orange" />
						<DequeRow label="Minimum candidates" entries={step.minDeque ?? []} tone="blue" />
					</>
				) : (
					<DequeRow label="Maximum candidates" entries={step.deque ?? []} tone="orange" />
				)}
			</div>
		</div>
	);
}
