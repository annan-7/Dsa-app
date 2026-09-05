import type { ProblemDefinition } from "@/libs/types";
import { generatePermutationInStringBruteForceSteps, generatePermutationInStringOptimizedSteps } from "@/libs/Algorithms/SlidingWindow/permutation-in-string";

const brutePseudocode = [
	"for each window of pattern length:",
	"  count its characters",
	"  compare counts with the pattern",
];

const optimizedPseudocode = [
	"counts = {}",
	"for right in range(0, n):",
	"  add s[right] and remove s[left]",
	"  if counts match: return true",
];

export const permutationInStringProblem: ProblemDefinition = {
	patternSlug: "sliding-window",
	problemSlug: "permutation-in-string",
	title: "Permutation in String",
	description: "Return true if s2 contains a permutation of s1 as a contiguous substring.",
	summary: "The brute force version rebuilds a frequency map for every fixed-size window. The optimized version updates one map as the window slides.",
	input: "eidbaooo".split(""),
	target: "ab",
	defaultMode: "optimized",
	visualization: "array-hashmap",
	pseudocode: { brute: brutePseudocode, optimized: optimizedPseudocode },
	complexity: {
		brute: { time: "O(nm)", space: "O(m)", detail: "Each of the O(n) candidate windows builds and compares frequencies for the pattern length m." },
		optimized: { time: "O(n)", space: "O(m)", detail: "Each character enters and leaves the fixed-size window at most once." },
	},
	steps: { brute: generatePermutationInStringBruteForceSteps(), optimized: generatePermutationInStringOptimizedSteps() },
};