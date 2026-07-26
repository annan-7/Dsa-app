import type { AlgorithmStep, HashMapEntry } from "@/libs/types";

const numbers = [2, 7, 11, 15];
const target = 9;

function createStep(
	stepNumber: number,
	id: string,
	label: string,
	message: string,
	codeLine: number,
	action: AlgorithmStep["action"],
	activeIndices: number[],
	hashMap: HashMapEntry[],
	pointers: AlgorithmStep["pointers"] = {},
	foundIndices: number[] = [],
): AlgorithmStep {
	return {
		stepNumber,
		id,
		label,
		message,
		codeLine,
		action,
		array: numbers,
		activeIndices,
		foundIndices,
		pointers,
		hashMap,
	};
}

function mapEntries(store: Map<number, number>, highlightKey?: number, matchedKey?: number): HashMapEntry[] {
	return [...store.entries()].map(([key, value]) => ({
		key: String(key),
		value: String(value),
		highlighted: key === highlightKey,
		matched: key === matchedKey,
		inserted: true,
	}));
}

export function generateTwoSumBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [
		createStep(1, "brute-start", "Inspect all pairs", "Check every pair until the target is found.", 1, "move", [], []),
	];
	let stepNumber = 2;

	for (let i = 0; i < numbers.length - 1; i += 1) {
		for (let j = i + 1; j < numbers.length; j += 1) {
			const sum = numbers[i] + numbers[j];
			steps.push(createStep(stepNumber++, `brute-check-${i}-${j}`, `Compare ${i + 1} and ${j + 1}`, `Check ${numbers[i]} + ${numbers[j]} = ${sum}.`, 2, "compare", [i, j], []));
			if (sum === target) {
				steps.push(createStep(stepNumber++, `brute-found-${i}-${j}`, "Pair found", `Found ${numbers[i]} and ${numbers[j]} at indices ${i + 1} and ${j + 1}.`, 3, "found", [i, j], [], { i, j }, [i, j]));
				return steps;
			}
			steps.push(createStep(stepNumber++, `brute-skip-${i}-${j}`, "Skip pair", "This pair does not reach the target.", 4, "skip", [i, j], []));
		}
	}

	return steps;
}

export function generateTwoSumOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	let stepNumber = 1;
	const seen = new Map<number, number>();

	steps.push(createStep(stepNumber++, "optimized-start", "Start hash scan", "Store values as you scan and look for complements.", 1, "move", [], mapEntries(seen)));

	for (let index = 0; index < numbers.length; index += 1) {
		const value = numbers[index];
		const complement = target - value;
		steps.push(createStep(stepNumber++, `check-${index}`, `Check complement for ${value}`, `Need ${complement} to reach ${target}.`, 2, "compare", [index], mapEntries(seen, complement), { i: index }));

		if (seen.has(complement)) {
			steps.push(createStep(stepNumber++, `found-${index}`, "Pair found", `Found ${value} with ${complement}.`, 3, "found", [index, seen.get(complement) ?? index], mapEntries(seen, complement, complement), { i: index }, [index, seen.get(complement) ?? index]));
			return steps;
		}

		seen.set(value, index);
		steps.push(createStep(stepNumber++, `insert-${index}`, `Insert ${value}`, `Store ${value} at index ${index + 1}.`, 4, "move", [index], mapEntries(seen, value), { i: index }));
	}

	return steps;
}
