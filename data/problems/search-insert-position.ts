import type { ProblemDefinition } from "@/libs/types";
import {
	generateSearchInsertPositionBruteForceSteps,
	generateSearchInsertPositionOptimizedSteps,
} from "@/libs/Algorithms/BinarySearch/search-insert-position";

const brutePseudocode = [
  "initialize linear scan",
  "for each index: compare value with target",
  "  if value >= target: return index"
];

const optimizedPseudocode = [
  "left = 0; right = n - 1",
  "while left <= right: inspect midpoint",
  "  if value == target: return midpoint",
  "  move the appropriate bound past midpoint",
  "return left as insertion index"
];

export const searchInsertPositionProblem: ProblemDefinition = {
	patternSlug: "binary-search",
	problemSlug: "search-insert-position",
	title: "Search Insert Position",
	description: "Find the index where a target should be inserted into a sorted array.",
	summary: "The brute approach scans linearly, while the optimized version narrows the search interval with binary search until the insertion point is clear.",
	input: [1, 3, 5, 6],
	target: 5,
	defaultMode: "optimized",
	visualization: "array",
	pseudocode: {
		brute: brutePseudocode,
		optimized: optimizedPseudocode,
	},
	complexity: {
		brute: { time: "O(n)", space: "O(1)", detail: "The array is checked from left to right." },
		optimized: { time: "O(log n)", space: "O(1)", detail: "Each step halves the search interval." },
	},
	steps: { brute: generateSearchInsertPositionBruteForceSteps(), optimized: generateSearchInsertPositionOptimizedSteps() },
};
