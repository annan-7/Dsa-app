import type { AlgorithmStep } from "@/libs/types";

const nums = [2, 3, 1, 2, 4, 3];
const target = 7;

function makeStep(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], left: number, right: number, windowLength: number): AlgorithmStep {
	return { stepNumber, id, label, message, codeLine, action, array: nums, activeIndices: left <= right ? [left, right] : [], foundIndices: [], pointers: { left, right }, windowRange: [left, right], windowLength };
}

export function generateMinimumSizeSubarraySumBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [{ stepNumber: 1, id: "brute-start", label: "Try every start", message: `Check every contiguous subarray and stop extending a start once its sum reaches ${target}.`, codeLine: 1, action: "move", array: nums, activeIndices: [], foundIndices: [], pointers: {} }];
	let best = Number.POSITIVE_INFINITY;
	for (let left = 0; left < nums.length; left += 1) {
		let sum = 0;
		for (let right = left; right < nums.length; right += 1) {
			sum += nums[right];
			steps.push(makeStep(steps.length + 1, `brute-${left}-${right}`, "Evaluate subarray", `The window sum is ${sum}; compare it with target ${target}.`, 2, "compare", left, right, right - left + 1));
			if (sum >= target) {
				best = Math.min(best, right - left + 1);
				break;
			}
		}
	}
	const result = best === Number.POSITIVE_INFINITY ? 0 : best;
	steps.push(makeStep(steps.length + 1, "brute-result", result === 0 ? "No solution" : `Minimum length ${result}`, result === 0 ? `No subarray reaches ${target}; return 0.` : `The shortest qualifying subarray has length ${result}.`, 3, result === 0 ? "skip" : "found", 0, nums.length - 1, result));
	return steps;
}

export function generateMinimumSizeSubarraySumOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [makeStep(1, "optimized-start", "Start sliding window", `Expand right and shrink left whenever the sum reaches ${target}.`, 1, "move", 0, 0, 1)];
	let left = 0;
	let sum = 0;
	let best = Number.POSITIVE_INFINITY;
	for (let right = 0; right < nums.length; right += 1) {
		sum += nums[right];
		steps.push(makeStep(steps.length + 1, `expand-${right}`, "Expand window", `Add ${nums[right]}; the window sum is now ${sum}.`, 2, "move", left, right, right - left + 1));
		while (sum >= target) {
			best = Math.min(best, right - left + 1);
			steps.push(makeStep(steps.length + 1, `best-${left}-${right}`, "Record qualifying window", `Sum ${sum} reaches the target, so length ${right - left + 1} is a candidate.`, 3, "found", left, right, right - left + 1));
			sum -= nums[left];
			left += 1;
			if (left <= right) steps.push(makeStep(steps.length + 1, `shrink-${left}`, "Shrink window", `Remove the left value; the remaining sum is ${sum}.`, 4, "move", left, right, right - left + 1));
		}
	}
	const result = best === Number.POSITIVE_INFINITY ? 0 : best;
	steps.push(makeStep(steps.length + 1, "optimized-result", result === 0 ? "No solution" : `Minimum length ${result}`, result === 0 ? `No contiguous window reaches ${target}; return 0.` : `The minimum qualifying length is ${result}.`, 5, result === 0 ? "skip" : "found", 0, nums.length - 1, result));
	return steps;
}
