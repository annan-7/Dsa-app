import type { AlgorithmStep } from "@/libs/types";

const nums = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0];
const k = 2;

function makeStep(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], left: number, right: number, windowLength: number, array = nums): AlgorithmStep {
	return { stepNumber, id, label, message, codeLine, action, array, activeIndices: left <= right ? [left, right] : [], foundIndices: [], pointers: { left, right }, windowRange: [left, right], windowLength };
}

export function generateMaxConsecutiveOnesIIIBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [{ stepNumber: 1, id: "brute-start", label: "Try every window", message: `Inspect every subarray and count its zeroes; at most ${k} may be flipped.`, codeLine: 1, action: "move", array: nums, activeIndices: [], foundIndices: [], pointers: {} }];
	let best = 0;
	for (let left = 0; left < nums.length; left += 1) {
		let zeroes = 0;
		for (let right = left; right < nums.length; right += 1) {
			zeroes += nums[right] === 0 ? 1 : 0;
			if (zeroes > k) break;
			best = Math.max(best, right - left + 1);
			steps.push(makeStep(steps.length + 1, `brute-${left}-${right}`, "Valid window", `This window has ${zeroes} zeroes, so its all-ones length is ${right - left + 1}.`, 2, "compare", left, right, right - left + 1));
		}
	}
	steps.push(makeStep(steps.length + 1, "brute-result", `Longest length ${best}`, `The longest window needing at most ${k} flips has length ${best}.`, 3, "found", 0, nums.length - 1, best));
	return steps;
}

export function generateMaxConsecutiveOnesIIIOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [makeStep(1, "optimized-start", "Start sliding window", `Keep at most ${k} zeroes inside the window.`, 1, "move", 0, 0, 1)];
	let left = 0;
	let zeroes = 0;
	let best = 0;
	for (let right = 0; right < nums.length; right += 1) {
		zeroes += nums[right] === 0 ? 1 : 0;
		steps.push(makeStep(steps.length + 1, `expand-${right}`, "Expand window", `Include ${nums[right]}; the window now contains ${zeroes} zeroes.`, 2, "move", left, right, right - left + 1));
		while (zeroes > k) {
			if (nums[left] === 0) zeroes -= 1;
			left += 1;
			steps.push(makeStep(steps.length + 1, `shrink-${left}`, "Too many zeroes", `Move left until only ${k} zeroes remain available to flip.`, 3, "move", left, right, right - left + 1));
		}
		best = Math.max(best, right - left + 1);
		steps.push(makeStep(steps.length + 1, `best-${right}`, "Update best", `The valid window length is ${right - left + 1}; best is ${best}.`, 4, "found", left, right, right - left + 1));
	}
	steps.push(makeStep(steps.length + 1, "optimized-result", `Longest length ${best}`, `Flip at most ${k} zeroes to obtain a longest run of ${best} ones.`, 5, "found", 0, nums.length - 1, best));
	return steps;
}
