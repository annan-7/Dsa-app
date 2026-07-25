"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/libs/utiles";

type BadgeTone = "default" | "orange" | "blue" | "green" | "emerald" | "pink";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
	default: "border-zinc-700 bg-zinc-900 text-zinc-300",
	orange: "border-orange-500/30 bg-orange-500/10 text-orange-200",
	blue: "border-blue-500/30 bg-blue-500/10 text-blue-200",
	green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
	emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
	pink: "border-pink-500/30 bg-pink-500/10 text-pink-200",
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide",
				toneClasses[tone],
				className,
			)}
			{...props}
		/>
	);
}
