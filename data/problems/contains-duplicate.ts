import type { ProblemDefinition } from "@/libs/types";
import {
	generateContainsDuplicateBruteForceSteps,
	generateContainsDuplicateOptimizedSteps,
} from "@/libs/Algorithms/Array&Hashing/contains-duplicate";

const brutePseudocode = [
  "for every pair of distinct indices",
  "  compare their values",
  "  if equal: return true",
  "  otherwise: continue scanning"
];

const optimizedPseudocode = [
  "initialize seen map",
  "for each value: check seen",
  "  if present: return true",
  "  otherwise: store current index"
];

export const containsDuplicateProblem: ProblemDefinition = {
	patternSlug: "array-and-hashing",
	problemSlug: "contains-duplicate",
	title: "Contains Duplicate",
	description: "Check whether any value appears more than once.",
	summary: "A brute-force scan compares all pairs, while the optimized version uses a hash map to detect repeats in one pass.",
	input: [1, 2, 3, 1],
	defaultMode: "optimized",
	visualization: "array-hashmap",
	pseudocode: {
		brute: brutePseudocode,
		optimized: optimizedPseudocode,
	},
	complexity: {
		brute: { time: "O(n^2)", space: "O(1)", detail: "Every pair is compared directly." },
		optimized: { time: "O(n)", space: "O(n)", detail: "The hash map remembers values seen so far." },
	},
	steps: { brute: generateContainsDuplicateBruteForceSteps(), optimized: generateContainsDuplicateOptimizedSteps() },
};
