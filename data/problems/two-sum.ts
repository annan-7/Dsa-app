import type { ProblemDefinition } from "@/libs/types";
import { generateTwoSumBruteForceSteps, generateTwoSumOptimizedSteps } from "@/libs/Algorithms/Array&Hashing/two-sum";

const brutePseudocode = [
	"for i in range(0, n - 1):",
	"  for j in range(i + 1, n):",
	"    if nums[i] + nums[j] == target: return pair",
];

const optimizedPseudocode = [
	"seen = {}",
	"for num in nums:",
	"  if target - num in seen: return pair",
	"  seen[num] = index",
];

export const twoSumProblem: ProblemDefinition = {
	patternSlug: "array-and-hashing",
	problemSlug: "two-sum",
	title: "Two Sum",
	description: "Find two values in an unsorted array that add to the target.",
	summary: "Brute force tries every pair. The optimized version stores seen values in a hash map and checks complements in constant time.",
	input: [2, 7, 11, 15],
	target: 9,
	defaultMode: "optimized",
	visualization: "array-hashmap",
	pseudocode: {
		brute: brutePseudocode,
		optimized: optimizedPseudocode,
	},
	complexity: {
		brute: { time: "O(n^2)", space: "O(1)", detail: "Every pair is checked directly." },
		optimized: { time: "O(n)", space: "O(n)", detail: "A hash map stores seen values so complements can be checked instantly." },
	},
	steps: { brute: generateTwoSumBruteForceSteps(), optimized: generateTwoSumOptimizedSteps() },
};
