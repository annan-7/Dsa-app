"use client";

import { motion } from "framer-motion";
import type { AlgorithmStep } from "@/libs/types";
import { cn } from "@/libs/utiles";

interface StackVisualizerProps {
	step: AlgorithmStep;
}

export function StackVisualizer({ step }: StackVisualizerProps) {
	const tokens = step.array.map(String);
	const stack = step.stack ?? [];
	const cellWidth = 44;
	const cellGap = 10;
	const inputWidth = tokens.length * cellWidth + Math.max(tokens.length - 1, 0) * cellGap;
	const stackX = inputWidth + 96;
	const stackTopY = 34;

	return (
		<div className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/90 p-5 shadow-xl shadow-black/20">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="text-sm font-semibold text-zinc-100">Execution state</p>
					<p className="mt-1 text-xs uppercase tracking-[0.28em] text-zinc-500">{step.label}</p>
				</div>
				<div className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
					{step.currentIndex !== undefined ? `Current char: ${step.currentChar ?? tokens[step.currentIndex]}` : "Initializing"}
				</div>
			</div>

			<div className="relative mt-8 h-[340px] overflow-hidden rounded-[1.5rem] border border-zinc-800 bg-zinc-950/70 p-5">
				<div className="relative h-full">
					<div className="absolute left-0 top-0">
						<div className="mb-3 text-xs uppercase tracking-[0.26em] text-zinc-500">Input</div>
						<div className="flex items-center gap-[10px]">
							{tokens.map((token, index) => {
								const active = step.currentIndex === index;
								return (
									<motion.div
										key={`${token}-${index}`}
										className={cn(
											"flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-semibold transition-colors duration-200",
											active ? "border-orange-400 bg-orange-500/15 text-orange-200" : "border-zinc-800 bg-zinc-900 text-zinc-300",
										)}
										animate={{ scale: active ? 1.08 : 1 }}
										transition={{ type: "spring", stiffness: 300, damping: 24 }}
									>
										{token}
									</motion.div>
								);
							})}
						</div>
					</div>

					<div className="absolute right-0 top-0 w-[220px]">
						<div className="mb-3 text-xs uppercase tracking-[0.26em] text-zinc-500">Stack</div>
						<div className="flex min-h-[220px] flex-col-reverse items-center justify-start gap-2 rounded-[1.25rem] border border-zinc-800 bg-zinc-900/50 px-4 py-4">
							{stack.length === 0 ? (
								<div className="mt-auto text-sm text-zinc-600">Empty</div>
							) : (
								stack.map((item, index) => {
									const top = index === stack.length - 1;
									return (
										<motion.div
											key={`${item}-${index}`}
											className={cn(
												"flex h-11 w-28 items-center justify-center rounded-xl border text-sm font-semibold",
												top ? "border-orange-400 bg-orange-500/15 text-orange-200" : "border-zinc-800 bg-zinc-950 text-zinc-300",
											)}
											initial={{ opacity: 0, x: 24 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ type: "spring", stiffness: 260, damping: 22 }}
										>
											{item}
										</motion.div>
									);
								})
							)}
						</div>
					</div>

					{step.currentIndex !== undefined && stack.length > 0 ? (
						<svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${stackX + 140} 260`} preserveAspectRatio="none">
							<line
								x1={step.currentIndex * (cellWidth + cellGap) + cellWidth / 2 + 20}
								y1={stackTopY + 90}
								x2={stackX + 52}
								y2={150}
								stroke="rgba(249, 115, 22, 0.75)"
								strokeWidth="2.5"
								strokeDasharray="6 6"
								opacity="0.9"
							/>
						</svg>
					) : null}
				</div>
			</div>
		</div>
	);
}