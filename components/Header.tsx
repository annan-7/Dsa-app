"use client";

import type { ReactNode } from "react";
import { cn } from "@/libs/utiles";

interface HeaderProps {
	eyebrow?: string;
	title: string;
	description: string;
	actions?: ReactNode;
	stats?: Array<{ label: string; value: string }>;
	className?: string;
}

export function Header({ eyebrow, title, description, actions, stats, className }: HeaderProps) {
	return (
		<header className={cn("flex flex-col gap-6 border-b border-zinc-800/70 pb-6", className)}>
			<div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
				<div className="max-w-3xl space-y-4">
					{eyebrow ? (
						<p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-300/90">{eyebrow}</p>
					) : null}
					<div className="space-y-3">
						<h1 className="text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">{title}</h1>
						<p className="max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">{description}</p>
					</div>
				</div>
				{actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
			</div>
			{stats ? (
				<div className="grid gap-3 sm:grid-cols-3">
					{stats.map((stat) => (
						<div key={stat.label} className="rounded-2xl border border-zinc-800 bg-zinc-900/75 px-4 py-3">
							<div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{stat.label}</div>
							<div className="mt-2 text-lg font-semibold text-zinc-100">{stat.value}</div>
						</div>
					))}
				</div>
			) : null}
		</header>
	);
}
