"use client";

import { motion } from "framer-motion";
import { cn } from "@/libs/utiles";

type PointerTone = "orange" | "blue" | "emerald" | "pink";

interface PointerProps {
	label: string;
	index: number;
	tone: PointerTone;
	cellWidth: number;
	cellGap: number;
}

const toneClasses: Record<PointerTone, { label: string; line: string; arrow: string }> = {
	orange: {
		label: "border-orange-500/30 bg-orange-500/10 text-orange-300",
		line: "bg-orange-500/70",
		arrow: "border-t-orange-500",
	},
	blue: {
		label: "border-blue-500/30 bg-blue-500/10 text-blue-300",
		line: "bg-blue-500/70",
		arrow: "border-t-blue-500",
	},
	emerald: {
		label: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
		line: "bg-emerald-500/70",
		arrow: "border-t-emerald-500",
	},
	pink: {
		label: "border-pink-500/30 bg-pink-500/10 text-pink-300",
		line: "bg-pink-500/70",
		arrow: "border-t-pink-500",
	},
};

export function Pointer({ label, index, tone, cellWidth, cellGap }: PointerProps) {
	const classes = toneClasses[tone];

	return (
		<motion.div
			className="absolute left-0 top-0 flex -translate-y-full flex-col items-center"
			initial={false}
			animate={{ x: index * (cellWidth + cellGap) }}
			transition={{ type: "spring", stiffness: 300, damping: 25 }}
			style={{ width: cellWidth }}
		>
			<div className={cn("rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] shadow-lg", classes.label)}>
				{label}
			</div>
			<div className={cn("mt-1 h-5 w-px", classes.line)} />
			<div className={cn("h-0 w-0 border-x-[7px] border-x-transparent border-t-[9px]", classes.arrow)} />
		</motion.div>
	);
}
