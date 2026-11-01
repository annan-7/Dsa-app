import type { ProblemDefinition } from "@/libs/types";
import {
	generateLongestRepeatingCharacterReplacementBruteForceSteps,
	generateLongestRepeatingCharacterReplacementOptimizedSteps,
} from "@/libs/Algorithms/SlidingWindow/longest-repeating-character-replacement";

const brutePseudocode = [
  "for each left: reset counts and maximum frequency",
  "  for each right: add character; calculate replacements",
  "    if replacements <= k: update best window",
  "return best length"
];

const optimizedPseudocode = [
  "left = best = 0; counts = empty map",
  "for each right: add character; find maximum frequency",
  "  while invalid: remove left; advance; recompute maximum",
  "  update best valid window",
  "return best length"
];

export const longestRepeatingCharacterReplacementProblem: ProblemDefinition = {
	patternSlug: "sliding-window",
	problemSlug: "longest-repeating-character-replacement",
	title: "Longest Repeating Character Replacement",
	description: "Find the longest substring that can be made uniform with at most k replacements.",
	summary: "The brute pass checks every window manually, while the optimized version uses a sliding window and frequency counts to keep the search linear.",
	input: ["A", "A", "B", "A", "B", "B", "A"],
	target: 1,
	defaultMode: "optimized",
	visualization: "array",
	pseudocode: {
		brute: brutePseudocode,
		optimized: optimizedPseudocode,
	},
	complexity: {
		brute: { time: "O(n^2)", space: "O(1)", detail: "Each start builds counts incrementally across all endings; at most 26 uppercase letters are tracked." },
		optimized: { time: "O(n)", space: "O(1)", detail: "Recompute the true maximum across at most 26 uppercase letters after each removal; both pointers move forward." },
	},
	steps: {
		brute: generateLongestRepeatingCharacterReplacementBruteForceSteps(),
		optimized: generateLongestRepeatingCharacterReplacementOptimizedSteps(),
	},
};
