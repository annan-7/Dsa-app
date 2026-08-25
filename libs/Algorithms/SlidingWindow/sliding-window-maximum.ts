import type { AlgorithmStep, DequeEntry } from "@/libs/types";

const numbers = [1, 3, -1, -3, 5, 3, 6, 7];
const windowSize = 3;

function makeStep(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], left: number, right: number, deque: number[], foundIndices: number[] = []): AlgorithmStep {
	const dequeEntries: DequeEntry[] = deque.map((index) => ({ index, value: numbers[index], role: "max" }));
	return {
		stepNumber,
		id,
		label,
		message,
		codeLine,
		action,
		array: numbers,
		activeIndices: [...deque],
		foundIndices,
		pointers: { left, right },
		windowRange: [left, right],
		windowLength: right >= left ? right - left + 1 : 0,
		deque: dequeEntries,
	};
}

export function generateSlidingWindowMaximumBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [
		makeStep(1, "brute-start", "Check every window", "Inspect each window of length 3 and scan it for the largest value.", 1, "move", 0, 0, []),
	];
	let bestValues: number[] = [];

	for (let left = 0; left <= numbers.length - windowSize; left += 1) {
		const right = left + windowSize - 1;
		const maximum = Math.max(...numbers.slice(left, right + 1));
		bestValues.push(maximum);
		const maximumIndex = numbers.indexOf(maximum, left);
		steps.push(makeStep(steps.length + 1, `brute-window-${left}`, "Scan window", `The window [${left}, ${right}] has maximum ${maximum}.`, 2, "compare", left, right, Array.from({ length: windowSize }, (_, index) => left + index), [maximumIndex]));
	}

	steps.push(makeStep(steps.length + 1, "brute-found", "Maximums found", `The window maximums are [${bestValues.join(", ")}].`, 3, "found", 0, numbers.length - 1, []));
	return steps;
}

export function generateSlidingWindowMaximumOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	const deque: number[] = [];
	let stepNumber = 1;

	steps.push(makeStep(stepNumber++, "optimized-start", "Start monotonic deque", "Keep candidate indices in decreasing value order so the front is the window maximum.", 1, "move", 0, 0, deque));

	for (let right = 0; right < numbers.length; right += 1) {
		const left = Math.max(0, right - windowSize + 1);
		while (deque.length > 0 && deque[0] < left) {
			const removed = deque.shift() as number;
			steps.push(makeStep(stepNumber++, "expire-" + right, "Remove expired index", `Index ${removed} left the window, so remove it from the front of the deque.`, 2, "move", left, right, deque));
		}

		while (deque.length > 0 && numbers[deque[deque.length - 1]] <= numbers[right]) {
			const removed = deque.pop() as number;
			steps.push(makeStep(stepNumber++, "dominated-" + right + "-" + removed, "Discard smaller candidate", `Value ${numbers[removed]} at index ${removed} cannot be a future maximum because ${numbers[right]} is newer and at least as large.`, 3, "compare", left, right, deque));
		}

		deque.push(right);
		steps.push(makeStep(stepNumber++, "enqueue-" + right, "Add candidate", `Add index ${right}; the deque remains decreasing by value.`, 4, "move", left, right, deque));

		if (right >= windowSize - 1) {
			steps.push(makeStep(stepNumber++, "maximum-" + right, "Read window maximum", `The deque front is index ${deque[0]}, so the maximum is ${numbers[deque[0]]}.`, 5, "found", left, right, deque, [deque[0]]));
		}
	}

	const result = [3, 3, 5, 5, 6, 7];
	steps.push(makeStep(stepNumber, "optimized-found", "Maximums found", `The monotonic deque produces [${result.join(", ")}].`, 6, "found", numbers.length - windowSize, numbers.length - 1, deque));
	return steps;
}