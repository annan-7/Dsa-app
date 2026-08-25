import type { AlgorithmStep } from "@/libs/types";

const numbers = [1, 5, 4, 2, 9, 9, 9];
const k = 3;

function makeStep(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], left: number, right: number, sum: number): AlgorithmStep {
	return { stepNumber, id, label, message, codeLine, action, array: numbers, activeIndices: [left, right], foundIndices: action === "found" ? [left, right] : [], pointers: { left, right }, windowRange: [left, right], windowLength: k };
}

export function generateMaximumSumOfDistinctSubarraysBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [{ stepNumber: 1, id: "brute-start", label: "Test every window", message: `Check each window of length ${k} for duplicate values before using its sum.`, codeLine: 1, action: "move", array: numbers, activeIndices: [], foundIndices: [], pointers: {} }];
	let stepNumber = 2;
	let best = 0;
	for (let left = 0; left <= numbers.length - k; left += 1) {
		const window = numbers.slice(left, left + k);
		const distinct = new Set(window).size === k;
		const sum = window.reduce((total, value) => total + value, 0);
		if (distinct) best = Math.max(best, sum);
		steps.push(makeStep(stepNumber++, distinct ? "distinct-" + left : "duplicate-" + left, distinct ? "Distinct window" : "Duplicate found", `${window.join(", ")} has ${distinct ? `sum ${sum}; best is ${best}` : "a duplicate, so skip it"}.`, 2, distinct ? "found" : "skip", left, left + k - 1, sum));
	}
	return steps;
}

export function generateMaximumSumOfDistinctSubarraysOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [{ stepNumber: 1, id: "optimized-start", label: "Track a distinct window", message: "Maintain frequencies, a rolling sum, and a window of exactly k values.", codeLine: 1, action: "move", array: numbers, activeIndices: [0, 0], foundIndices: [], pointers: { left: 0, right: 0 }, windowRange: [0, 0], windowLength: 1 }];
	const counts = new Map<number, number>();
	let left = 0;
	let sum = 0;
	let best = 0;
	let stepNumber = 2;
	for (let right = 0; right < numbers.length; right += 1) {
		sum += numbers[right];
		counts.set(numbers[right], (counts.get(numbers[right]) ?? 0) + 1);
		while ((counts.get(numbers[right]) ?? 0) > 1 || right - left + 1 > k) {
			counts.set(numbers[left], (counts.get(numbers[left]) ?? 0) - 1);
			sum -= numbers[left];
			left += 1;
		}
		if (right - left + 1 === k) best = Math.max(best, sum);
		steps.push(makeStep(stepNumber++, right - left + 1 === k ? "distinct-window-" + right : "adjust-" + right, right - left + 1 === k ? "Evaluate distinct window" : "Adjust window", `Window sum is ${sum}; ${right - left + 1 === k ? `best distinct sum is ${best}` : "remove repeated or excess values"}.`, 2, right - left + 1 === k ? "found" : "move", left, right, sum));
	}
	return steps;
}