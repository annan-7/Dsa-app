import type { AlgorithmStep, HashMapEntry } from "@/libs/types";

const numbers = [1, 2, 3, 1];

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

export function generateContainsDuplicateBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [
		createStep(1, "brute-start", "Inspect all pairs", "Compare every pair of values to expose the duplicate cost.", 1, "move", [], []),
	];
	let stepNumber = 2;

	for (let i = 0; i < numbers.length - 1; i += 1) {
		for (let j = i + 1; j < numbers.length; j += 1) {
			const duplicate = numbers[i] === numbers[j];
			steps.push(createStep(stepNumber++, `brute-check-${i}-${j}`, `Compare ${numbers[i]} and ${numbers[j]}`, `Check whether ${numbers[i]} and ${numbers[j]} are the same value.`, 2, "compare", [i, j], []));

			if (duplicate) {
				steps.push(createStep(stepNumber++, `brute-found-${i}-${j}`, "Duplicate found", `The value ${numbers[i]} repeats at indices ${i + 1} and ${j + 1}.`, 3, "found", [i, j], [], { i, j }, [i, j]));
				return steps;
			}

			steps.push(createStep(stepNumber++, `brute-skip-${i}-${j}`, "Skip pair", "This pair is still unique, so continue scanning.", 4, "skip", [i, j], []));
		}
	}

	return steps;
}

export function generateContainsDuplicateOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	let stepNumber = 1;
	const seen = new Map<number, number>();

	steps.push(createStep(stepNumber++, "optimized-start", "Start hash scan", "Store values as you scan and check for a prior copy.", 1, "move", [], mapEntries(seen)));

	for (let index = 0; index < numbers.length; index += 1) {
		const value = numbers[index];
		steps.push(createStep(stepNumber++, `check-${index}`, `Check ${value}`, `Look for ${value} in the seen values table.`, 2, "compare", [index], mapEntries(seen, value), { i: index }));

		if (seen.has(value)) {
			steps.push(createStep(stepNumber++, `found-${index}`, "Duplicate found", `Found ${value} again, so the array contains a duplicate.`, 3, "found", [index, seen.get(value) ?? index], mapEntries(seen, value, value), { i: index }, [index, seen.get(value) ?? index]));
			return steps;
		}

		seen.set(value, index);
		steps.push(createStep(stepNumber++, `insert-${index}`, `Insert ${value}`, `Store ${value} at index ${index + 1} for future checks.`, 4, "move", [index], mapEntries(seen, value), { i: index }));
	}

	return steps;
}
