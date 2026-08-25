import type { AlgorithmStep, DequeEntry } from "@/libs/types";

const numbers = [8, 2, 4, 7];
const limit = 4;

function range(start: number, end: number): number[] {
	return start <= end ? Array.from({ length: end - start + 1 }, (_, index) => start + index) : [];
}

function makeStep(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], left: number, right: number, activeIndices: number[], foundIndices: number[] = [], maxDeque: number[] = [], minDeque: number[] = []): AlgorithmStep {
	return {
		stepNumber,
		id,
		label,
		message,
		codeLine,
		action,
		array: numbers,
		activeIndices: [...new Set(activeIndices)],
		foundIndices,
		pointers: { left, right },
		windowRange: [left, right],
		windowLength: right >= left ? right - left + 1 : 0,
		maxDeque: maxDeque.map((index) => ({ index, value: numbers[index], role: "max" })),
		minDeque: minDeque.map((index) => ({ index, value: numbers[index], role: "min" })),
	};
}

export function generateLongestContinuousSubarrayBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [
		makeStep(1, "brute-start", "Check every subarray", "Expand every starting position and track each subarray's minimum and maximum.", 1, "move", 0, 0, []),
	];
	let bestLeft = 0;
	let bestRight = 0;

	for (let left = 0; left < numbers.length; left += 1) {
		let minimum = numbers[left];
		let maximum = numbers[left];
		for (let right = left; right < numbers.length; right += 1) {
			minimum = Math.min(minimum, numbers[right]);
			maximum = Math.max(maximum, numbers[right]);
			const valid = maximum - minimum <= limit;
			if (valid && right - left > bestRight - bestLeft) {
				bestLeft = left;
				bestRight = right;
			}
			steps.push(makeStep(steps.length + 1, `brute-${left}-${right}`, valid ? "Valid subarray" : "Limit exceeded", `Subarray [${left}, ${right}] has range ${maximum - minimum}, ${valid ? "so it is valid" : "so it is rejected"}.`, 2, valid ? "compare" : "skip", left, right, range(left, right), valid && right === bestRight && left === bestLeft ? range(bestLeft, bestRight) : []));
		}
	}

	steps.push(makeStep(steps.length + 1, "brute-found", "Longest subarray found", `The longest valid subarray has length ${bestRight - bestLeft + 1}.`, 3, "found", bestLeft, bestRight, range(bestLeft, bestRight), range(bestLeft, bestRight)));
	return steps;
}

export function generateLongestContinuousSubarrayOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	const maxDeque: number[] = [];
	const minDeque: number[] = [];
	let stepNumber = 1;
	let left = 0;
	let bestLeft = 0;
	let bestRight = 0;

	steps.push(makeStep(stepNumber++, "optimized-start", "Start two monotonic deques", "Keep maximum candidates decreasing and minimum candidates increasing while the window expands.", 1, "move", 0, 0, []));

	for (let right = 0; right < numbers.length; right += 1) {
		while (maxDeque.length > 0 && numbers[maxDeque[maxDeque.length - 1]] <= numbers[right]) maxDeque.pop();
		maxDeque.push(right);
		while (minDeque.length > 0 && numbers[minDeque[minDeque.length - 1]] >= numbers[right]) minDeque.pop();
		minDeque.push(right);
			steps.push(makeStep(stepNumber++, "enqueue-" + right, "Update monotonic deques", `Add ${numbers[right]}; max deque front is ${numbers[maxDeque[0]]} and min deque front is ${numbers[minDeque[0]]}.`, 2, "move", left, right, [...maxDeque, ...minDeque], [], maxDeque, minDeque));

		while (numbers[maxDeque[0]] - numbers[minDeque[0]] > limit) {
			steps.push(makeStep(stepNumber++, "shrink-" + right + "-" + left, "Shrink invalid window", `Range ${numbers[maxDeque[0]] - numbers[minDeque[0]]} exceeds ${limit}, so move left past index ${left}.`, 3, "move", left, right, [...maxDeque, ...minDeque], [], maxDeque, minDeque));
			if (maxDeque[0] === left) maxDeque.shift();
			if (minDeque[0] === left) minDeque.shift();
			left += 1;
		}

		if (right - left > bestRight - bestLeft) {
			bestLeft = left;
			bestRight = right;
		}
		steps.push(makeStep(stepNumber++, "valid-" + right, "Record valid window", `The current range fits the limit, giving a valid window of length ${right - left + 1}.`, 4, "found", left, right, [...maxDeque, ...minDeque], range(bestLeft, bestRight), maxDeque, minDeque));
	}

	steps.push(makeStep(stepNumber, "optimized-found", "Longest subarray found", `The longest valid subarray has length ${bestRight - bestLeft + 1}.`, 5, "found", bestLeft, bestRight, [...maxDeque, ...minDeque], range(bestLeft, bestRight), maxDeque, minDeque));
	return steps;
}