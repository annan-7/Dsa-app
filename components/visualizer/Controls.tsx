"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { cn } from "@/libs/utiles";

interface ControlsProps {
	isPlaying: boolean;
	speed: number;
	onPlayPause: () => void;
	onNext: () => void;
	onPrev: () => void;
	onReset: () => void;
	onSpeedChange: (speed: number) => void;
}

const speedOptions = [0.75, 1, 1.5, 2];

export function Controls({
	isPlaying,
	speed,
	onPlayPause,
	onNext,
	onPrev,
	onReset,
	onSpeedChange,
}: ControlsProps) {
	return (
		<div className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 xl:flex-row xl:items-center xl:justify-between">
			<div className="flex flex-wrap items-center gap-3">
				<Button variant="primary" onClick={onPlayPause}>
					{isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
					{isPlaying ? "Pause" : "Play"}
				</Button>
				<Button variant="secondary" onClick={onPrev}>
					<SkipBack className="h-4 w-4" />
					Step back
				</Button>
				<Button variant="secondary" onClick={onNext}>
					<SkipForward className="h-4 w-4" />
					Step forward
				</Button>
				<Button variant="ghost" onClick={onReset}>
					<RotateCcw className="h-4 w-4" />
					Reset
				</Button>
			</div>

			<div className="flex items-center gap-2">
				<span className="text-xs uppercase tracking-[0.28em] text-zinc-500">Speed</span>
				<div className="flex rounded-full border border-zinc-800 bg-zinc-900 p-1">
					{speedOptions.map((option) => {
						const active = option === speed;

						return (
							<motion.button
								key={option}
								type="button"
								whileTap={{ scale: 0.95 }}
								onClick={() => onSpeedChange(option)}
								className={cn(
									"rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200",
									active ? "bg-orange-500 text-zinc-950" : "text-zinc-400 hover:text-zinc-100",
								)}
							>
								{option}x
							</motion.button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
