import type { AlgorithmStep } from "@/libs/types";

const values = [1, 3, 5, 6];
const target = 5;

function step(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], left: number, right: number, mid: number): AlgorithmStep {
	return {
		stepNumber,
		id,
		label,
		message,
		codeLine,
		action,
		array: values,
		activeIndices: [left, mid, right],
		foundIndices: [],
		pointers: { left, right },
	};
}

export function generateSearchInsertPositionBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [
		step(1, "brute-start", "Scan linearly", "Check each value until the insertion point is found.", 1, "move", 0, values.length - 1, 0),
	];

	for (let index = 0; index < values.length; index += 1) {
		steps.push(step(steps.length + 1, `brute-check-${index}`, `Inspect ${values[index]}`, `Compare ${values[index]} with the target ${target}.`, 2, "compare", index, values.length - 1, index));
		if (values[index] >= target) {
			steps.push(step(steps.length + 1, `brute-found-${index}`, "Insertion point found", `The target belongs before ${values[index]} at index ${index}.`, 3, "found", index, values.length - 1, index));
			break;
		}
	}

	return steps;
}

export function generateSearchInsertPositionOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	let left = 0;
	let right = values.length - 1;
	let stepNumber = 1;

	steps.push(step(stepNumber++, "optimized-start", "Start binary search", "Initialize the search interval across the sorted array.", 1, "move", left, right, Math.floor((left + right) / 2)));

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		steps.push(step(stepNumber++, `mid-${mid}`, `Check midpoint ${mid}`, `Inspect the middle value ${values[mid]} against the target ${target}.`, 2, "compare", left, right, mid));

		if (values[mid] === target) {
			steps.push(step(stepNumber++, `found-${mid}`, "Target found", `The target exists at index ${mid}.`, 3, "found", left, right, mid));
			break;
		}

		if (values[mid] < target) {
			left = mid + 1;
			steps.push(step(stepNumber++, `move-right-${mid}`, "Move right", `The target is larger, so move the left bound to the right.`, 4, "move", left, right, mid));
		} else {
			right = mid - 1;
			steps.push(step(stepNumber++, `move-left-${mid}`, "Move left", `The target is smaller, so move the right bound to the left.`, 4, "move", left, right, mid));
		}
	}

	if (left > right) {
		steps.push(step(stepNumber, "optimized-insert", "Return insertion index", `The insertion point is ${left}.`, 5, "found", left, right, left));
	}

	return steps;
}
