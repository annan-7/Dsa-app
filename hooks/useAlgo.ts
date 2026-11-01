"use client";

import { useEffect, useState } from "react";
import type { AlgorithmMode, AlgorithmStep } from "@/libs/types";

interface StepGroups { brute: AlgorithmStep[]; optimized: AlgorithmStep[] }
interface UseAlgoOptions { defaultMode?: AlgorithmMode; defaultSpeed?: number }

export function useAlgo(stepGroups: StepGroups, options: UseAlgoOptions = {}) {
  const initial = () => ({ groups: stepGroups, mode: options.defaultMode ?? "optimized" as AlgorithmMode,
    stepIndex: 0, isPlaying: false, speed: options.defaultSpeed ?? 1 });
  const [state, setState] = useState(initial);
  // Reset during render so changed data never commits a stale frame or timer.
  if (state.groups !== stepGroups) setState(initial());
  const current = state.groups === stepGroups ? state : initial();
  const { mode, stepIndex, speed, isPlaying } = current;
  const steps = stepGroups[mode];

  useEffect(() => {
    if (!isPlaying || steps.length <= 1) return;
    const timer = setTimeout(() => {
      setState(previous => {
        if (previous.groups !== stepGroups || previous.mode !== mode || !previous.isPlaying) return previous;
        const nextIndex = Math.min(previous.stepIndex + 1, steps.length - 1);
        return { ...previous, stepIndex: nextIndex, isPlaying: nextIndex < steps.length - 1 };
      });
    }, Math.max(220, Math.round(1200 / speed)));
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, speed, steps.length, stepGroups, mode]);

  const setMode = (nextMode: AlgorithmMode) => setState(previous => ({ ...previous, mode: nextMode, stepIndex: 0, isPlaying: false }));
  const setSpeed = (nextSpeed: number) => {
    if (Number.isFinite(nextSpeed) && nextSpeed > 0) setState(previous => ({ ...previous, speed: nextSpeed }));
  };
  const playPause = () => setState(previous => steps.length <= 1 ? previous : ({ ...previous,
    stepIndex: previous.stepIndex >= steps.length - 1 ? 0 : previous.stepIndex, isPlaying: !previous.isPlaying }));
  const next = () => setState(previous => ({ ...previous, stepIndex: Math.min(previous.stepIndex + 1, Math.max(steps.length - 1, 0)), isPlaying: false }));
  const prev = () => setState(previous => ({ ...previous, stepIndex: Math.max(previous.stepIndex - 1, 0), isPlaying: false }));
  const reset = () => setState(previous => ({ ...previous, stepIndex: 0, isPlaying: false }));
  const progress = steps.length === 0 ? 0 : steps.length === 1 ? 100 : Math.min(100, (stepIndex / (steps.length - 1)) * 100);
  return { mode, setMode, stepIndex, totalSteps: steps.length, currentStep: steps[stepIndex],
    isPlaying, speed, setSpeed, playPause, next, prev, reset, progress };
}
