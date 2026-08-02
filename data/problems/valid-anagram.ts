import type { ProblemDefinition } from "@/libs/types";
import {
	generateValidAnagramBruteForceSteps,
	generateValidAnagramOptimizedSteps,
} from "@/libs/Algorithms/Array&Hashing/valid-anagram";

const brutePseudocode = [
	"sortedLeft = sort(s)",
	"sortedRight = sort(t)",
	"return sortedLeft == sortedRight",
];

const optimizedPseudocode = [
	"counts = {}",
	"for char in s:",
	"  counts[char] += 1",
	"for char in t:",
	"  counts[char] -= 1",
	"return all(counts.values() == 0)",
];

export const validAnagramProblem: ProblemDefinition = {
	patternSlug: "array-and-hashing",
	problemSlug: "valid-anagram",
	title: "Valid Anagram",
	description: "Determine whether two strings contain the same letters with the same frequencies.",
	summary: "The brute route sorts both inputs, while the optimized version uses frequency counts to compare their character distribution.",
	input: ["anagram", "nagaram"],
	defaultMode: "optimized",
	visualization: "array-hashmap",
	pseudocode: {
		brute: brutePseudocode,
		optimized: optimizedPseudocode,
	},
	complexity: {
		brute: { time: "O(n log n)", space: "O(n)", detail: "Sorting both strings dominates the cost." },
		optimized: { time: "O(n)", space: "O(k)", detail: "Character counts are updated in a single pass per string." },
	},
	steps: { brute: generateValidAnagramBruteForceSteps(), optimized: generateValidAnagramOptimizedSteps() },
};
