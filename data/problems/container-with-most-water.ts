import type { ProblemDefinition } from "@/libs/types";
import {
	generateContainerWithMostWaterBruteForceSteps,
	generateContainerWithMostWaterOptimizedSteps,
} from "@/libs/Algorithms/TwoPointer/container-with-most-water";

const brutePseudocode = [
  "initialize best = 0",
  "for every pair: calculate area and update best",
  "return best area"
];

const optimizedPseudocode = [
  "left = 0; right = n - 1; best = 0",
  "while left < right: calculate area and update best",
  "  if left wall is shorter: advance left",
  "  otherwise: decrease right",
  "return best area"
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
