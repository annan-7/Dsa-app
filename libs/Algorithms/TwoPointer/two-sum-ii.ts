import type { AlgorithmStep } from "@/libs/types";

const input = [1, 2, 3, 4, 6, 8, 11, 15];
const target = 15;

function buildStep(
	stepNumber: number,
	id: string,
	label: string,
	message: string,
	codeLine: number,
	action: NonNullable<AlgorithmStep["action"]>,
	activeIndices: number[],
	pointers: AlgorithmStep["pointers"],
	foundIndices: number[] = [],
): AlgorithmStep {
	return {
		stepNumber,
		id,
		label,
		message,
		codeLine,
		action,
		array: input,
		activeIndices,
		foundIndices,
		pointers,
	};
}

export function generateTwoSumIIBruteForceSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	let stepNumber = 1;

	steps.push(
		buildStep(
			stepNumber++,
			"brute-start",
			"Initialize brute force",
			"Check every pair so the search cost is visible.",
			1,
			"move",
			[],
			{},
		),
	);

	for (let i = 0; i < input.length - 1; i += 1) {
		steps.push(
			buildStep(
				stepNumber++,
				`brute-i-${i}`,
				`Fix left index ${i}`,
				`Anchor ${input[i]} at index ${i} and scan the remaining values.`,
				2,
				"move",
				[i],
				{ i },
			),
		);

		for (let j = i + 1; j < input.length; j += 1) {
			const sum = input[i] + input[j];

			steps.push(
				buildStep(
					stepNumber++,
					`brute-compare-${i}-${j}`,
					`Compare pair ${i + 1}, ${j + 1}`,
					`Compare ${input[i]} + ${input[j]} against ${target}.`,
					3,
					"compare",
					[i, j],
					{ i, j },
				),
			);

			steps.push(
				buildStep(
					stepNumber++,
					`brute-calc-${i}-${j}`,
					`Calculate sum ${sum}`,
					`The current pair adds up to ${sum}.`,
					4,
					"calculate",
					[i, j],
					{ i, j },
				),
			);

			if (sum === target) {
				steps.push(
					buildStep(
						stepNumber++,
						`brute-found-${i}-${j}`,
						"Pair found",
						`Found the target at values ${input[i]} and ${input[j]}.`,
						5,
						"found",
						[i, j],
						{ i, j },
						[i, j],
					),
				);
			} else {
				steps.push(
					buildStep(
						stepNumber++,
						`brute-skip-${i}-${j}`,
						"Skip pair",
						"This pair does not match the target, so continue scanning.",
						5,
						"skip",
						[i, j],
						{ i, j },
					),
				);
			}
		}
	}

	return steps;
}

export function generateTwoSumIIOptimizedSteps(): AlgorithmStep[] {
	const steps: AlgorithmStep[] = [];
	let stepNumber = 1;
	let left = 0;
	let right = input.length - 1;

	steps.push(
		buildStep(
			stepNumber++,
			"optimized-start",
			"Initialize two pointers",
			"Start from both ends of the sorted array.",
			1,
			"move",
			[],
			{ left, right },
		),
	);

	while (left < right) {
		steps.push(
			buildStep(
				stepNumber++,
				`optimized-compare-${left}-${right}`,
				"Compare current window",
				`Compare ${input[left]} + ${input[right]} against ${target}.`,
				2,
				"compare",
				[left, right],
				{ left, right },
			),
		);

		const sum = input[left] + input[right];

		steps.push(
			buildStep(
				stepNumber++,
				`optimized-calc-${left}-${right}`,
				`Calculate sum ${sum}`,
				`The current window sums to ${sum}.`,
				3,
				"calculate",
				[left, right],
				{ left, right },
			),
		);

		if (sum === target) {
			steps.push(
				buildStep(
					stepNumber++,
					`optimized-found-${left}-${right}`,
					"Pair found",
					`Found the target using ${input[left]} and ${input[right]}.`,
					4,
					"found",
					[left, right],
					{ left, right },
					[left, right],
				),
			);
			break;
		}

		if (sum < target) {
			steps.push(
				buildStep(
					stepNumber++,
					`optimized-move-left-${left}-${right}`,
					"Move left pointer",
					"Sum is too small, so move the left pointer inward.",
					5,
					"move",
					[left, right],
					{ left, right },
				),
			);
			left += 1;
		} else {
			steps.push(
				buildStep(
					stepNumber++,
					`optimized-move-right-${left}-${right}`,
					"Move right pointer",
					"Sum is too large, so move the right pointer inward.",
					6,
					"move",
					[left, right],
					{ left, right },
				),
			);
			right -= 1;
		}
	}

	return steps;
}

export const twoSumIIProblemInput = input;
export const twoSumIITarget = target;