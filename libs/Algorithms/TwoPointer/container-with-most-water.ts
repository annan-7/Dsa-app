import type { AlgorithmStep } from "@/libs/types";

const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];

function step(stepNumber: number, id: string, label: string, message: string, codeLine: number, action: AlgorithmStep["action"], left: number, right: number, area: number, best: number): AlgorithmStep {
	return {
		stepNumber,
		id,
		label,
		message,
		codeLine,
		action,
		array: heights,
		activeIndices: [left, right],
		foundIndices: best === area ? [left, right] : [],
		pointers: { left, right },
		waterFill: {
			startIndex: left,
			endIndex: right,
			height: Math.min(heights[left], heights[right]),
			area,
		},
	};
}

export function generateContainerWithMostWaterBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	let stepNumber = 1;
	let best = 0;

	steps.push({
		stepNumber: stepNumber++,
		id: "brute-start",
		label: "Inspect every container",
		message: "Try every pair of lines and measure the area they can hold.",
		codeLine: 1,
		action: "move",
		array: heights,
		activeIndices: [],
		foundIndices: [],
		pointers: {},
	});

	for (let left = 0; left < heights.length - 1; left += 1) {
		for (let right = left + 1; right < heights.length; right += 1) {
			const area = Math.min(heights[left], heights[right]) * (right - left);
			best = Math.max(best, area);

			steps.push(step(stepNumber++, `brute-area-${left}-${right}`, "Calculate area", `Area between ${left + 1} and ${right + 1} is ${area}.`, 2, "calculate", left, right, area, best));
		}
	}

	steps.push({
		stepNumber,
		id: "brute-found",
		label: "Best area found",
		message: `The maximum area discovered by brute force is ${best}.`,
		codeLine: 3,
		action: "found",
		array: heights,
		activeIndices: [],
		foundIndices: [],
		pointers: {},
	});

	return steps;
}

export function generateContainerWithMostWaterOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	let stepNumber = 1;
	let left = 0;
	let right = heights.length - 1;
	let best = 0;

	steps.push(step(stepNumber++, "optimized-start", "Start with outer walls", "Use two pointers and move the shorter wall inward.", 1, "move", left, right, 0, 0));

	while (left < right) {
		const area = Math.min(heights[left], heights[right]) * (right - left);
		best = Math.max(best, area);
		steps.push(step(stepNumber++, `optimized-calc-${left}-${right}`, "Measure water", `Current area is ${area}.`, 2, "calculate", left, right, area, best));

		if (heights[left] < heights[right]) {
			steps.push(step(stepNumber++, `move-left-${left}`, "Move left pointer", `Height ${heights[left]} is shorter, so move left inward.`, 3, "move", left, right, area, best));
			left += 1;
		} else {
			steps.push(step(stepNumber++, `move-right-${right}`, "Move right pointer", `Height ${heights[right]} is shorter or equal, so move right inward.`, 4, "move", left, right, area, best));
			right -= 1;
		}
	}

	steps.push(step(stepNumber, "optimized-found", "Maximum container", `The best area found is ${best}.`, 5, "found", 1, heights.length - 1, best, best));

	return steps;
}
