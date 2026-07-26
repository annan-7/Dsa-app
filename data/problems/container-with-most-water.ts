import type { ProblemDefinition } from "@/libs/types";
import {
	generateContainerWithMostWaterBruteForceSteps,
	generateContainerWithMostWaterOptimizedSteps,
} from "@/libs/Algorithms/TwoPointer/container-with-most-water";

const brutePseudocode = [
	"for left in range(0, n - 1):",
	"  for right in range(left + 1, n):",
	"    area = min(height[left], height[right]) * (right - left)",
	"    update best area",
];

const optimizedPseudocode = [
	"left = 0, right = n - 1",
	"while left < right:",
	"  area = min(height[left], height[right]) * width",
	"  move shorter wall inward",
];

export const containerWithMostWaterProblem: ProblemDefinition = {
	patternSlug: "two-pointers",
	problemSlug: "container-with-most-water",
	title: "Container With Most Water",
	description: "Choose two lines that trap the most water.",
	summary: "Brute force measures every pair, while the optimized sweep moves the shorter boundary inward and keeps the tallest container candidate alive.",
	input: [1, 8, 6, 2, 5, 4, 8, 3, 7],
	defaultMode: "optimized",
	visualization: "array",
	pseudocode: {
		brute: brutePseudocode,
		optimized: optimizedPseudocode,
	},
	complexity: {
		brute: {
			time: "O(n^2)",
			space: "O(1)",
			detail: "Every pair of walls is measured directly.",
		},
		optimized: {
			time: "O(n)",
			space: "O(1)",
			detail: "The pointer on the shorter wall moves inward, shrinking the search while preserving the best possible area gain.",
		},
	},
	steps: {
		brute: generateContainerWithMostWaterBruteForceSteps(),
		optimized: generateContainerWithMostWaterOptimizedSteps(),
	},
};
