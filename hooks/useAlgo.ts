"use client";

import { useEffect, useMemo, useState } from "react";
import type { AlgorithmMode, AlgorithmStep } from "@/libs/types";

interface StepGroups {
	brute: AlgorithmStep[];
	optimized: AlgorithmStep[];
}

interface UseAlgoOptions {
	defaultMode?: AlgorithmMode;
	defaultSpeed?: number;
}

export function useAlgo(stepGroups: StepGroups, options: UseAlgoOptions = {}) {
	const [mode, setMode] = useState<AlgorithmMode>(options.defaultMode ?? "optimized");
	const [stepIndex, setStepIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [speed, setSpeed] = useState(options.defaultSpeed ?? 1);

	const steps = mode === "brute" ? stepGroups.brute : stepGroups.optimized;

	useEffect(() => {
		setStepIndex(0);
		setIsPlaying(false);
	}, [mode]);

	useEffect(() => {
		if (!isPlaying || steps.length <= 1) {
			return;
		}

		const interval = window.setInterval(() => {
			setStepIndex((current) => {
				if (current >= steps.length - 1) {
					window.clearInterval(interval);
					setIsPlaying(false);
					return current;
				}

				return current + 1;
			});
		}, Math.max(220, Math.round(1200 / speed)));

		return () => window.clearInterval(interval);
	}, [isPlaying, speed, steps.length]);

	const currentStep = useMemo(() => steps[Math.min(stepIndex, steps.length - 1)] ?? steps[0], [steps, stepIndex]);

	const playPause = () => setIsPlaying((value) => !value);
	const next = () => setStepIndex((current) => Math.min(current + 1, Math.max(steps.length - 1, 0)));
	const prev = () => setStepIndex((current) => Math.max(current - 1, 0));
	const reset = () => {
		setStepIndex(0);
		setIsPlaying(false);
	};

	const progress = steps.length <= 1 ? 100 : (stepIndex / (steps.length - 1)) * 100;

	return {
		mode,
		setMode,
		stepIndex,
		totalSteps: steps.length,
		currentStep,
		isPlaying,
		speed,
		setSpeed,
		playPause,
		next,
		prev,
		reset,
		progress,
	};
}
