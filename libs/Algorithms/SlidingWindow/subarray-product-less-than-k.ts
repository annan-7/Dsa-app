import type { AlgorithmStep } from "@/libs/types";

const nums = [10, 5, 2, 6];
const k = 100;

function makeStep(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], left: number, right: number, windowLength: number): AlgorithmStep {
	return { stepNumber, id, label, message, codeLine, action, array: nums, activeIndices: left <= right ? [left, right] : [], foundIndices: [], pointers: { left, right }, windowRange: [left, right], windowLength };
}

export function generateSubarrayProductLessThanKBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [{ stepNumber: 1, id: "brute-start", label: "Try every subarray", message: `Multiply each positive subarray and count products below ${k}.`, codeLine: 1, action: "move", array: nums, activeIndices: [], foundIndices: [], pointers: {} }];
	let total = 0;
	for (let left = 0; left < nums.length; left += 1) {
		let product = 1;
		for (let right = left; right < nums.length; right += 1) {
			product *= nums[right];
			if (product >= k) break;
			total += 1;
			steps.push(makeStep(steps.length + 1, `brute-${left}-${right}`, "Count valid subarray", `Product ${product} is below ${k}; total valid subarrays is ${total}.`, 2, "found", left, right, right - left + 1));
		}
	}
	steps.push(makeStep(steps.length + 1, "brute-result", `Count ${total}`, `There are ${total} positive-product subarrays below ${k}.`, 3, "found", 0, nums.length - 1, total));
	return steps;
}

export function generateSubarrayProductLessThanKOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [makeStep(1, "optimized-start", "Start sliding window", `Because every value is positive, shrink while the product reaches ${k}.`, 1, "move", 0, 0, 1)];
	if (k <= 1) {
		steps.push(makeStep(2, "optimized-invalid-threshold", "No valid subarrays", "A positive product cannot be less than a threshold of 1 or less; return 0.", 5, "skip", 0, nums.length - 1, 0));
		return steps;
	}
	let left = 0;
	let product = 1;
	let total = 0;
	for (let right = 0; right < nums.length; right += 1) {
		product *= nums[right];
		steps.push(makeStep(steps.length + 1, `expand-${right}`, "Expand window", `Multiply by ${nums[right]}; product is now ${product}.`, 2, "calculate", left, right, right - left + 1));
		while (product >= k && left <= right) {
			product /= nums[left];
			left += 1;
			steps.push(makeStep(steps.length + 1, `shrink-${left}`, "Product too large", `Remove the left value; product falls to ${product}.`, 3, "move", left, right, right - left + 1));
		}
		const added = right - left + 1;
		total += added;
		steps.push(makeStep(steps.length + 1, `count-${right}`, "Count valid endings", `Every subarray ending at ${right} from left ${left} is valid; add ${added}, total ${total}.`, 4, "found", left, right, added));
	}
	steps.push(makeStep(steps.length + 1, "optimized-result", `Count ${total}`, `There are ${total} subarrays with product less than ${k}.`, 5, "found", 0, nums.length - 1, total));
	return steps;
}
