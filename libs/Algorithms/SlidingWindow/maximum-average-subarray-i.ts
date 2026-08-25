import type { AlgorithmStep } from "@/libs/types";

const numbers = [1, 12, -5, -6, 50, 3];
const k = 4;

function makeStep(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], left: number, right: number, sum: number): AlgorithmStep {
	return { stepNumber, id, label, message, codeLine, action, array: numbers, activeIndices: [left, right], foundIndices: [], pointers: { left, right }, windowRange: [left, right], windowLength: right - left + 1, currentIndex: right, };
}

export function generateMaximumAverageSubarrayIBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [{ stepNumber: 1, id: "brute-start", label: "Try every window", message: `Inspect each contiguous window of length ${k} and compare its sum.`, codeLine: 1, action: "move", array: numbers, activeIndices: [], foundIndices: [], pointers: {} }];
	let stepNumber = 2;
	let bestSum = Number.NEGATIVE_INFINITY;
	let bestLeft = 0;
	for (let left = 0; left <= numbers.length - k; left += 1) {
		let sum = 0;
		for (let index = left; index < left + k; index += 1) sum += numbers[index];
		steps.push(makeStep(stepNumber++, `window-${left}`, "Evaluate window", `Window ${left + 1}-${left + k} has sum ${sum}, so its average is ${sum / k}.`, 2, "compare", left, left + k - 1, sum));
		if (sum > bestSum) { bestSum = sum; bestLeft = left; }
	}
	steps.push(makeStep(stepNumber, "brute-found", "Best average", `The best window starts at index ${bestLeft} and has average ${bestSum / k}.`, 3, "found", bestLeft, bestLeft + k - 1, bestSum));
	return steps;
}

export function generateMaximumAverageSubarrayIOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [{ stepNumber: 1, id: "optimized-start", label: "Build first window", message: `Sum the first ${k} values, then slide one value at a time.`, codeLine: 1, action: "move", array: numbers, activeIndices: [0, k - 1], foundIndices: [], pointers: { left: 0, right: k - 1 }, windowRange: [0, k - 1], windowLength: k }];
	let sum = numbers.slice(0, k).reduce((total, value) => total + value, 0);
	let bestSum = sum;
	let bestLeft = 0;
	let stepNumber = 2;
	for (let right = k; right < numbers.length; right += 1) {
		const left = right - k + 1;
		sum += numbers[right] - numbers[left - 1];
		if (sum > bestSum) { bestSum = sum; bestLeft = left; }
		steps.push(makeStep(stepNumber++, `slide-${right}`, "Slide window", `Add ${numbers[right]} and remove ${numbers[left - 1]}; the new sum is ${sum}.`, 2, "calculate", left, right, sum));
	}
	steps.push(makeStep(stepNumber, "optimized-found", "Best average", `The maximum average is ${bestSum / k} from the window starting at index ${bestLeft}.`, 3, "found", bestLeft, bestLeft + k - 1, bestSum));
	return steps;
}