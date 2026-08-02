import type { AlgorithmStep } from "@/libs/types";

const left = "anagram";
const right = "nagaram";
const chars = `${left} | ${right}`.split("");

function createStep(
	stepNumber: number,
	id: string,
	label: string,
	message: string,
	codeLine: number,
	action: AlgorithmStep["action"],
	activeIndices: number[],
	pointers: AlgorithmStep["pointers"] = {},
): AlgorithmStep {
	return {
		stepNumber,
		id,
		label,
		message,
		codeLine,
		action,
		array: chars,
		activeIndices,
		foundIndices: [],
		pointers,
	};
}

export function generateValidAnagramBruteForceSteps(): AlgorithmStep[] {
	return [
		createStep(1, "brute-start", "Compare character sets", "Sort both strings and compare them character by character.", 1, "move", []),
		createStep(2, "brute-compare", "Check frequency", "The strings are compared after their letters are arranged into a common order.", 2, "compare", [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13]),
		createStep(3, "brute-found", "Anagrams match", "The sorted character lists match exactly, so the strings are anagrams.", 3, "found", [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13]),
	];
}

export function generateValidAnagramOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [
		createStep(1, "optimized-start", "Count characters", "Build frequency counts for both strings and compare the totals.", 1, "move", []),
	];

	const counts = new Map<string, number>();
	for (let index = 0; index < left.length; index += 1) {
		const char = left[index];
		counts.set(char, (counts.get(char) ?? 0) + 1);
		steps.push(createStep(steps.length + 1, `count-left-${index}`, `Count ${char}`, `Add ${char} to the left-side frequency table.`, 2, "move", [index]));
	}

	for (let index = 0; index < right.length; index += 1) {
		const char = right[index];
		counts.set(char, (counts.get(char) ?? 0) - 1);
		steps.push(createStep(steps.length + 1, `count-right-${index}`, `Count ${char}`, `Subtract ${char} from the shared frequency table.`, 3, "compare", [left.length + 2 + index]));
	}

	steps.push(createStep(steps.length + 1, "optimized-found", "Balances are zero", "Every character count ends at zero, so the strings are anagrams.", 4, "found", [0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13]));
	return steps;
}
