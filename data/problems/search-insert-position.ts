import type { ProblemDefinition } from "@/libs/types";
import {
	generateSearchInsertPositionBruteForceSteps,
	generateSearchInsertPositionOptimizedSteps,
} from "@/libs/Algorithms/BinarySearch/search-insert-position";

const brutePseudocode = [
	"for index in range(0, n):",
	"  if nums[index] >= target: return index",
];

const optimizedPseudocode = [
	"left = 0, right = n - 1",
	"while left <= right:",
	"  mid = (left + right) // 2",
	"  if nums[mid] < target: left = mid + 1",
	"  else: right = mid - 1",
	"return left",
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
