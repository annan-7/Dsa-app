import type { AlgorithmStep } from "@/libs/types";

/** Rendering state only: the caller performs every algorithm operation. */
export function createTrace(array: Array<string | number>) {
  const steps: AlgorithmStep[] = [];
  function add(codeLine: number, label: string, message: string, state: Partial<AlgorithmStep> = {}) {
    steps.push({
      id: `step-${steps.length + 1}`, stepNumber: steps.length + 1,
      codeLine, label, message, array, activeIndices: [], foundIndices: [], pointers: {},
      ...state,
    });
  }
  return { steps, add };
}

export function windowState(left: number, right: number): Partial<AlgorithmStep> {
  return left >= 0 && right >= left ? {
    activeIndices: left === right ? [left] : [left, right],
    pointers: { left, right }, windowRange: [left, right], windowLength: right - left + 1,
  } : { windowLength: 0 };
}
