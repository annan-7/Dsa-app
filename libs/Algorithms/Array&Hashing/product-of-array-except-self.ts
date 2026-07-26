import type { AlgorithmStep } from "@/libs/types";

const numbers = [1, 2, 3, 4];

function buildStep(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], activeIndices: number[], foundIndices: number[] = [], pointers: AlgorithmStep["pointers"] = {}): AlgorithmStep {
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
	};
}

export function generateProductExceptSelfBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [buildStep(1, "brute-start", "Inspect each index", "Multiply all numbers except the current index.", 1, "move", [])];
	let stepNumber = 2;

	for (let i = 0; i < numbers.length; i += 1) {
		let product = 1;
		for (let j = 0; j < numbers.length; j += 1) {
			if (i === j) continue;
			product *= numbers[j];
		}
		steps.push(buildStep(stepNumber++, `brute-calc-${i}`, `Compute output ${i + 1}`, `Product except index ${i + 1} is ${product}.`, 2, "calculate", [i], [i]));
	}

	steps.push(buildStep(stepNumber, "brute-found", "All outputs computed", "The brute force output is complete.", 3, "found", []));
	return steps;
}

export function generateProductExceptSelfOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	let stepNumber = 1;
	const result = Array(numbers.length).fill(1);

	steps.push(buildStep(stepNumber++, "optimized-start", "Build prefix products", "Accumulate products from the left, then from the right.", 1, "move", []));

	let prefix = 1;
	for (let i = 0; i < numbers.length; i += 1) {
		result[i] = prefix;
		steps.push(buildStep(stepNumber++, `prefix-${i}`, `Prefix at ${i + 1}`, `Store left product ${prefix}.`, 2, "calculate", [i], [i]));
		prefix *= numbers[i];
	}

	let suffix = 1;
	for (let i = numbers.length - 1; i >= 0; i -= 1) {
		result[i] *= suffix;
		steps.push(buildStep(stepNumber++, `suffix-${i}`, `Suffix at ${i + 1}`, `Multiply by right product ${suffix}.`, 3, "calculate", [i], [i]));
		suffix *= numbers[i];
	}

	steps.push(buildStep(stepNumber, "optimized-found", `Final output ${result.join(", ")}`, "Prefix and suffix passes produce the answer without division.", 4, "found", []));
	return steps;
}
