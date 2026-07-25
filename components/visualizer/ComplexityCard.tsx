"use client";

import { Badge } from "@/components/ui/Badge";

interface ComplexityCardProps {
	title: string;
	time: string;
	space: string;
	detail: string;
	tone?: "orange" | "blue" | "green" | "pink" | "emerald";
}

export function ComplexityCard({ title, time, space, detail, tone = "orange" }: ComplexityCardProps) {
	return (
		<div className="rounded-[1.75rem] border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl shadow-black/20">
			<div className="flex items-center justify-between gap-3">
				<div>
					<p className="text-sm font-semibold text-zinc-100">{title}</p>
					<p className="mt-1 text-xs uppercase tracking-[0.28em] text-zinc-500">Complexity</p>
				</div>
				<Badge tone={tone}>Pattern</Badge>
			</div>
			<div className="mt-5 space-y-3 text-sm">
				<div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
					<div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Time</div>
					<div className="mt-1 font-semibold text-zinc-100">{time}</div>
				</div>
				<div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3">
					<div className="text-xs uppercase tracking-[0.22em] text-zinc-500">Space</div>
					<div className="mt-1 font-semibold text-zinc-100">{space}</div>
				</div>
			</div>
			<p className="mt-4 text-sm leading-6 text-zinc-400">{detail}</p>
		</div>
	);
}
