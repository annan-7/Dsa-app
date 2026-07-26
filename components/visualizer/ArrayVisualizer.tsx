"use client";

import { motion } from "framer-motion";
import { Pointer } from "@/components/visualizer/Pointer";
import type { AlgorithmStep, PointerKey } from "@/libs/types";
import { cn } from "@/libs/utiles";

interface ArrayVisualizerProps {
	step: AlgorithmStep;
}

const pointerTones: Record<PointerKey, "orange" | "blue" | "emerald" | "pink"> = {
	i: "orange",
	j: "blue",
	k: "pink",
	left: "blue",
	right: "emerald",
};

const pointerLabels: Record<PointerKey, string> = {
	i: "i",
	j: "j",
	k: "k",
	left: "left",
	right: "right",
};

export function ArrayVisualizer({ step }: ArrayVisualizerProps) {
	const cellWidth = 76;
	const cellGap = 12;
	const hasWindow = step.windowRange !== undefined;
	const windowStart = step.windowRange?.[0] ?? 0;
	const windowEnd = step.windowRange?.[1] ?? 0;
	const windowWidth = hasWindow ? (windowEnd - windowStart + 1) * cellWidth + (windowEnd - windowStart) * cellGap : 0;
	const windowLeft = hasWindow ? windowStart * (cellWidth + cellGap) : 0;

	return (
		<div className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/90 p-5 shadow-xl shadow-black/20">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="text-sm font-semibold text-zinc-100">Execution state</p>
					<p className="mt-1 text-xs uppercase tracking-[0.28em] text-zinc-500">{step.label}</p>
				</div>
				<div className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
					{step.activeIndices.length ? `Active indices: ${step.activeIndices.join(", ")}` : "Initializing"}
				</div>
			</div>

			<div className="relative mt-8 overflow-x-auto pb-5">
				<div className="relative mx-auto flex w-max items-end gap-3 px-2 pt-12">
					{hasWindow ? (
						<div
							className="absolute bottom-0 top-10 rounded-[1.5rem] border border-cyan-400/20 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.12)] transition-all duration-200 ease-out"
							style={{ left: windowLeft, width: windowWidth }}
						>
							<div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-full border border-cyan-400/30 bg-cyan-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200">
								Window {step.windowLength ?? windowEnd - windowStart + 1}
							</div>
						</div>
					) : null}

					{step.array.map((value, index) => {
						const active = step.activeIndices.includes(index);
						const found = step.foundIndices.includes(index);
						const inWindow = hasWindow && index >= windowStart && index <= windowEnd;

						return (
							<motion.div
								key={`${index}-${value}`}
								layout
								className={cn(
									"flex h-20 w-[76px] items-center justify-center rounded-2xl border text-lg font-semibold tabular-nums transition-colors duration-200",
									found
										? "border-emerald-400/70 bg-emerald-500/15 text-emerald-100 shadow-[0_0_30px_rgba(74,222,128,0.22)]"
										: inWindow
											? "border-cyan-400/60 bg-cyan-500/10 text-zinc-50 shadow-[0_0_20px_rgba(34,211,238,0.14)]"
										: active
											? "border-orange-400/70 bg-orange-500/15 text-zinc-50 shadow-[0_0_20px_rgba(249,115,22,0.14)]"
											: "border-zinc-800 bg-zinc-900 text-zinc-200",
								)}
								animate={{
									scale: active ? 1.05 : 1,
									y: found ? -2 : 0,
								}}
								transition={{ type: "spring", stiffness: 260, damping: 24 }}
							>
								{String(value)}
							</motion.div>
						);
					})}

					{step.waterFill ? (
						<div
							className="absolute bottom-0 rounded-t-[1.25rem] bg-gradient-to-t from-sky-500/45 via-cyan-400/25 to-transparent shadow-[0_0_30px_rgba(34,211,238,0.14)] transition-all duration-200 ease-out"
							style={{
								left: step.waterFill.startIndex * (cellWidth + cellGap),
								width: (step.waterFill.endIndex - step.waterFill.startIndex + 1) * cellWidth + (step.waterFill.endIndex - step.waterFill.startIndex) * cellGap,
								height: `${Math.max(18, Math.min(180, step.waterFill.height * 14))}px`,
							}}
						/>
					) : null}

					{Object.entries(step.pointers).map(([key, index]) => {
						if (index === undefined) {
							return null;
						}

						const pointerKey = key as PointerKey;

						return (
							<Pointer
								key={`${pointerKey}-${index}`}
								label={pointerLabels[pointerKey]}
								index={index}
								tone={pointerTones[pointerKey]}
								cellWidth={cellWidth}
								cellGap={cellGap}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
}
