import type { AlgorithmStep } from "@/libs/types";

const source = "AABABBA";
const k = 1;
const chars = source.split("");

function step(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], left: number, right: number, windowLength: number): AlgorithmStep {
	return {
		stepNumber,
		id,
		label,
		message,
		codeLine,
		action,
		array: chars,
		activeIndices: [left, right],
		foundIndices: [],
		pointers: { left, right },
		windowRange: [left, right],
		windowLength,
	};
}

export function generateLongestRepeatingCharacterReplacementBruteForceSteps(): AlgorithmStep[] {
	return [
		step(1, "brute-start", "Try every window", "Check each contiguous window and count how many replacements would be needed.", 1, "move", 0, 0, 1),
		step(2, "brute-window", "Evaluate candidate", `A window of length ${chars.length} is still valid with at most ${k} changes.`, 2, "compare", 0, chars.length - 1, chars.length),
		step(3, "brute-found", "Best window found", `The longest valid window has length ${chars.length}.`, 3, "found", 0, chars.length - 1, chars.length),
	];
}

export function generateLongestRepeatingCharacterReplacementOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	let stepNumber = 1;
	let left = 0;
	let best = 0;
	const counts = new Map<string, number>();
	let mostFrequent = 0;

	steps.push(step(stepNumber++, "optimized-start", "Start sliding window", `Expand the right edge while the window stays within ${k} replacements.`, 1, "move", 0, 0, 1));

	for (let right = 0; right < chars.length; right += 1) {
		const current = chars[right];
		counts.set(current, (counts.get(current) ?? 0) + 1);
		mostFrequent = Math.max(mostFrequent, counts.get(current) ?? 0);
		steps.push(step(stepNumber++, `expand-${right}`, "Expand window", `Add '${current}' to the window and update the character counts.`, 2, "move", left, right, right - left + 1));

		while (right - left + 1 - mostFrequent > k) {
			const leaving = chars[left];
			counts.set(leaving, (counts.get(leaving) ?? 0) - 1);
			left += 1;
			steps.push(step(stepNumber++, `shrink-${left}`, "Shrink window", `Remove '${leaving}' because the window has too many replacements.`, 3, "move", left, right, right - left + 1));
		}

		best = Math.max(best, right - left + 1);
		steps.push(step(stepNumber++, `best-${right}`, "Best window", `The current window length ${right - left + 1} is the best so far.`, 4, "found", left, right, right - left + 1));
	}

	steps.push(step(stepNumber, "optimized-found", `Longest valid window ${best}`, `The longest window that can be formed with at most ${k} replacements has length ${best}.`, 5, "found", 0, chars.length - 1, best));
	return steps;
}
