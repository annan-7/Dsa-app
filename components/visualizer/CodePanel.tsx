"use client";

import { motion } from "framer-motion";
import { cn } from "@/libs/utiles";

interface CodePanelProps {
	title: string;
	lines: string[];
	activeLine: number;
}

export function CodePanel({ title, lines, activeLine }: CodePanelProps) {
	return (
		<div className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/90 p-5 shadow-xl shadow-black/20">
			<div className="flex items-center justify-between gap-3 border-b border-zinc-800 pb-4">
				<div>
					<p className="text-sm font-semibold text-zinc-100">{title}</p>
					<p className="mt-1 text-xs uppercase tracking-[0.28em] text-zinc-500">Pseudocode</p>
				</div>
				<div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.35)]" />
			</div>
			<div className="mt-4 space-y-1.5 font-mono text-sm leading-6 text-zinc-400">
				{lines.map((line, index) => {
					const isActive = index + 1 === activeLine;

					return (
						<motion.div
							key={line}
							layout
							className={cn(
								"rounded-xl border-l-2 px-4 py-2 transition-colors duration-200 ease-out",
								isActive ? "border-orange-500 bg-orange-500/10 text-zinc-100" : "border-transparent hover:bg-zinc-900/70",
							)}
						>
							<span className="mr-3 select-none text-xs text-zinc-600">{index + 1}</span>
							<span>{line}</span>
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}
