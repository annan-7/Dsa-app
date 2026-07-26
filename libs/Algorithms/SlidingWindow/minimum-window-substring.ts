import type { AlgorithmStep } from "@/libs/types";

const source = "ADOBECODEBANC";
const target = "ABC";
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

export function generateMinimumWindowSubstringBruteForceSteps(): AlgorithmStep[] {
	return [
		{
			stepNumber: 1,
			id: "brute-start",
			label: "Check all windows",
			message: "Scan every substring until the shortest valid one is found.",
			codeLine: 1,
			action: "move",
			array: chars,
			activeIndices: [],
			foundIndices: [],
			pointers: {},
		},
		step(2, "brute-window", "Evaluate candidate", "The valid window 'BANC' is the shortest one found in this pass.", 2, "compare", 9, 12, 4),
		step(3, "brute-found", "Shortest window found", "The answer is 'BANC'.", 3, "found", 9, 12, 4),
	];
}

export function generateMinimumWindowSubstringOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	let stepNumber = 1;
	let left = 0;
	let bestLeft = 0;
	let bestRight = chars.length - 1;
	let formed = 0;
	const required = new Set(target.split("")).size;
	const counts = new Map<string, number>();

	steps.push(step(stepNumber++, "optimized-start", "Start sliding window", "Expand the right side until the window covers every target character.", 1, "move", 0, 0, 1));

	for (let right = 0; right < chars.length; right += 1) {
		const current = chars[right];
		counts.set(current, (counts.get(current) ?? 0) + 1);
		if (target.includes(current) && (counts.get(current) ?? 0) === 1) {
			formed += 1;
		}

		steps.push(step(stepNumber++, `expand-${right}`, "Expand window", `Include '${current}' and look for a complete match.`, 2, "move", left, right, right - left + 1));

		while (formed === required && left <= right) {
			if (right - left < bestRight - bestLeft) {
				bestLeft = left;
				bestRight = right;
				steps.push(step(stepNumber++, `best-${left}-${right}`, "Best window", `Window '${chars.slice(left, right + 1).join("")}' is the smallest valid span so far.`, 3, "found", left, right, right - left + 1));
			}

			const leftChar = chars[left];
			counts.set(leftChar, (counts.get(leftChar) ?? 0) - 1);
			if (target.includes(leftChar) && (counts.get(leftChar) ?? 0) === 0) {
				formed -= 1;
			}
			steps.push(step(stepNumber++, `shrink-${left}`, "Shrink window", `Move left past '${leftChar}'.`, 4, "move", left, right, right - left + 1));
			left += 1;
		}
	}

	steps.push(step(stepNumber, "optimized-found", `Minimum window ${chars.slice(bestLeft, bestRight + 1).join("")}`, `The shortest valid window is '${chars.slice(bestLeft, bestRight + 1).join("")}'.`, 5, "found", bestLeft, bestRight, bestRight - bestLeft + 1));
	return steps;
}
