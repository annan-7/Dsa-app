import type { AlgorithmStep } from "@/libs/types";

const text = "abcabcbb";
const chars = text.split("");

function makeStep(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], left: number, right: number, windowLength: number): AlgorithmStep {
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

export function generateLongestSubstringBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [
		{
			stepNumber: 1,
			id: "brute-start",
			label: "Check every start",
			message: "Expand each substring and stop when a repeated character appears.",
			codeLine: 1,
			action: "move",
			array: chars,
			activeIndices: [],
			foundIndices: [],
			pointers: {},
		},
	];

	steps.push(makeStep(2, "brute-window", "Evaluate substring", "The longest unique substring discovered in this pass is 'abc'.", 2, "compare", 0, 2, 3));
	steps.push(makeStep(3, "brute-found", "Best length found", "The maximum window length is 3.", 3, "found", 0, 2, 3));
	return steps;
}

export function generateLongestSubstringOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	let stepNumber = 1;
	const seen = new Map<string, number>();
	let left = 0;
	let best = 0;

	steps.push(makeStep(stepNumber++, "optimized-start", "Start sliding window", "Grow the window while removing duplicate characters from the left.", 1, "move", 0, 0, 1));

	for (let right = 0; right < chars.length; right += 1) {
		const current = chars[right];
		if (seen.has(current) && (seen.get(current) ?? 0) >= left) {
			const duplicateIndex = seen.get(current) ?? left;
			steps.push(makeStep(stepNumber++, `duplicate-${right}`, "Duplicate found", `Move left past the previous '${current}'.`, 2, "compare", left, right, right - left + 1));
			left = duplicateIndex + 1;
		}

		seen.set(current, right);
		best = Math.max(best, right - left + 1);
		steps.push(makeStep(stepNumber++, `expand-${right}`, "Expand window", `Window '${chars.slice(left, right + 1).join("")}' has length ${right - left + 1}.`, 3, "move", left, right, right - left + 1));
	}

	steps.push(makeStep(stepNumber, "optimized-found", `Longest length ${best}`, "The longest substring without repeating characters has length 3.", 4, "found", 0, chars.length - 1, best));
	return steps;
}
