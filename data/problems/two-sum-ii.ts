import type { ProblemDefinition } from "@/libs/types";
import {
	generateTwoSumIIBruteForceSteps,
	generateTwoSumIIOptimizedSteps,
	twoSumIIProblemInput,
	twoSumIITarget,
} from "@/libs/Algorithms/TwoPointer/two-sum-ii";

const brutePseudocode = [
	"for i in range(0, n - 1):",
	"  for j in range(i + 1, n):",
	"    sum = numbers[i] + numbers[j]",
	"    if sum == target: return pair",
];

const optimizedPseudocode = [
	"left = 0, right = n - 1",
	"while left < right:",
	"  sum = numbers[left] + numbers[right]",
	"  if sum == target: return pair",
	"  if sum < target: left += 1",
	"  else: right -= 1",
];

export const twoSumIIProblem: ProblemDefinition = {
	patternSlug: "two-pointers",
	problemSlug: "two-sum-ii",
	title: "Two Sum II",
	description: "Find two numbers in a sorted array that add up to the target.",
	summary: "The brute force version checks every pair, while the optimized version starts at both ends and slides inward to hit the target faster.",
	input: twoSumIIProblemInput,
	target: twoSumIITarget,
	defaultMode: "optimized",
	pseudocode: {
		brute: brutePseudocode,
		optimized: optimizedPseudocode,
	},
	complexity: {
		brute: {
			time: "O(n^2)",
			space: "O(1)",
			detail: "Every pair is checked directly, which is simple but slow as the array grows.",
		},
		optimized: {
			time: "O(n)",
			space: "O(1)",
			detail: "The two-pointer sweep uses the sorted order to discard one side of the search on every comparison.",
		},
	},
	steps: {
		brute: generateTwoSumIIBruteForceSteps(),
		optimized: generateTwoSumIIOptimizedSteps(),
	},
};