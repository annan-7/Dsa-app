"use client";

import { cn } from "@/libs/utiles";

interface ProgressBarProps {
	value: number;
	className?: string;
}

export function ProgressBar({ value, className }: ProgressBarProps) {
	return (
		<div className={cn("h-2 w-full overflow-hidden rounded-full bg-zinc-800", className)}>
			<div
				className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-[width] duration-300 ease-out"
				style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
			/>
		</div>
	);
}
