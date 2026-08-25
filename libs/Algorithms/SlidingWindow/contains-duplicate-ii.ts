import type { AlgorithmStep } from "@/libs/types";

const numbers = [1, 2, 3, 1];
const k = 3;

function makeStep(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], index: number, otherIndex?: number): AlgorithmStep {
	const activeIndices = otherIndex === undefined ? [index] : [otherIndex, index];
	return { stepNumber, id, label, message, codeLine, action, array: numbers, activeIndices, foundIndices: action === "found" ? activeIndices : [], pointers: { i: index, j: otherIndex ?? index }, windowRange: [Math.max(0, index - k), index], windowLength: Math.min(k + 1, index + 1), currentIndex: index };
}

export function generateContainsDuplicateIIBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [{ stepNumber: 1, id: "brute-start", label: "Check nearby pairs", message: `Compare each value with earlier values no more than ${k} indices away.`, codeLine: 1, action: "move", array: numbers, activeIndices: [], foundIndices: [], pointers: {} }];
	let stepNumber = 2;
	for (let index = 0; index < numbers.length; index += 1) {
		for (let previous = Math.max(0, index - k); previous < index; previous += 1) {
			const duplicate = numbers[previous] === numbers[index];
			steps.push(makeStep(stepNumber++, `check-${previous}-${index}`, "Compare pair", `Compare ${numbers[previous]} at ${previous} with ${numbers[index]} at ${index}.`, 2, duplicate ? "found" : "compare", index, previous));
			if (duplicate) return steps;
		}
	}
	return steps;
}

export function generateContainsDuplicateIIOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [{ stepNumber: 1, id: "optimized-start", label: "Track recent indices", message: "Store the latest index for each value so distance checks are constant time.", codeLine: 1, action: "move", array: numbers, activeIndices: [], foundIndices: [], pointers: {} }];
	const lastSeen = new Map<number, number>();
	let stepNumber = 2;
	for (let index = 0; index < numbers.length; index += 1) {
		const previous = lastSeen.get(numbers[index]);
		if (previous !== undefined && index - previous <= k) {
			steps.push(makeStep(stepNumber, "optimized-found", "Nearby duplicate", `${numbers[index]} repeats within ${k} indices, at ${previous} and ${index}.`, 3, "found", index, previous));
			return steps;
		}
		lastSeen.set(numbers[index], index);
		steps.push(makeStep(stepNumber++, `store-${index}`, "Store latest index", `Remember ${numbers[index]} at index ${index} for future distance checks.`, 2, "move", index));
	}
	return steps;
}