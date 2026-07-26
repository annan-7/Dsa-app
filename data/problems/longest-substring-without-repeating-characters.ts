import type { ProblemDefinition } from "@/libs/types";
import { generateLongestSubstringBruteForceSteps, generateLongestSubstringOptimizedSteps } from "@/libs/Algorithms/SlidingWindow/longest-substring-without-repeating-characters";

const brutePseudocode = [
	"for each start position:",
	"  expand until a duplicate appears",
	"  track the best length",
];

const optimizedPseudocode = [
	"left = 0",
	"for right in range(0, n):",
	"  if char already in window: move left",
	"  update best length",
];

export const longestSubstringWithoutRepeatingCharactersProblem: ProblemDefinition = {
	patternSlug: "sliding-window",
	problemSlug: "longest-substring-without-repeating-characters",
	title: "Longest Substring Without Repeating Characters",
	description: "Find the longest substring that contains no repeated characters.",
	summary: "Brute force expands from each starting point. The optimized version keeps a window and contracts only when a duplicate appears.",
	input: "abcabcbb".split(""),
	defaultMode: "optimized",
	visualization: "array",
	pseudocode: { brute: brutePseudocode, optimized: optimizedPseudocode },
	complexity: { brute: { time: "O(n^2)", space: "O(n)", detail: "Each start position can expand across much of the string." }, optimized: { time: "O(n)", space: "O(n)", detail: "The window moves at most once per character using last-seen positions." } },
	steps: { brute: generateLongestSubstringBruteForceSteps(), optimized: generateLongestSubstringOptimizedSteps() },
};
