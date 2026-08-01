import type { ProblemDefinition } from "@/libs/types";
import {
	generateLongestRepeatingCharacterReplacementBruteForceSteps,
	generateLongestRepeatingCharacterReplacementOptimizedSteps,
} from "@/libs/Algorithms/SlidingWindow/longest-repeating-character-replacement";

const brutePseudocode = [
	"for left in range(0, n):",
	"  for right in range(left + 1, n):",
	"    if replacements_needed(window) <= k: update best",
];

const optimizedPseudocode = [
	"left = 0",
	"counts = {}",
	"for right in range(0, n):",
	"  add s[right] to counts",
	"  while window has too many replacements:",
	"    remove s[left] and move left",
	"  update best",
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
		brute: { time: "O(n^2)", space: "O(1)", detail: "Every possible window is assessed independently." },
		optimized: { time: "O(n)", space: "O(1)", detail: "The window expands and shrinks in constant additional work per step." },
	},
	steps: {
		brute: generateLongestRepeatingCharacterReplacementBruteForceSteps(),
		optimized: generateLongestRepeatingCharacterReplacementOptimizedSteps(),
	},
};
