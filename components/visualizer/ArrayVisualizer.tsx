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
					{step.array.map((value, index) => {
						const active = step.activeIndices.includes(index);
						const found = step.foundIndices.includes(index);

						return (
							<motion.div
								key={`${index}-${value}`}
								layout
								className={cn(
									"flex h-20 w-[76px] items-center justify-center rounded-2xl border text-lg font-semibold tabular-nums transition-colors duration-200",
									found
										? "border-emerald-400/70 bg-emerald-500/15 text-emerald-100 shadow-[0_0_30px_rgba(74,222,128,0.22)]"
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
								{value}
							</motion.div>
						);
					})}

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
